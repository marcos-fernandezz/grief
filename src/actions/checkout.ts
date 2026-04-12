'use server';

import { db } from "@/lib/db";
import { payment } from "@/lib/mercadopago";
import { CartItem } from "@/store/cartStore";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type CheckoutResponse =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function processOrder(
  cartItems: CartItem[],
  customerData: any,
  paymentFormData: any
): Promise<CheckoutResponse> {
  try {
    const session = await getServerSession(authOptions);

    // 1. Validar sesión
    const userId = (session?.user as any)?.id;
    if (!session?.user || !userId) {
      return { success: false, error: "Debes iniciar sesión para finalizar la compra." };
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: "El carrito está vacío." };
    }

    // 2. Validar stock y calcular total exacto (Lectura)
    const productIds = cartItems.map(item => item.id);
    const dbStocks = await db.productSize.findMany({
      where: { productId: { in: productIds } },
      include: { product: true }
    });

    let totalAmount = 0;
    for (const item of cartItems) {
      const stockInfo = dbStocks.find(s => s.productId === item.id && s.size === item.size);
      if (!stockInfo || stockInfo.stock < item.quantity) {
        return { success: false, error: `Sin stock suficiente para: ${item.name} (Talle ${item.size})` };
      }
      totalAmount += stockInfo.product.price * item.quantity;
    }

    // Aseguramos que el total es un número apto para MP
    const finalAmount = Number(totalAmount.toFixed(2));

    // 3. Crear orden PENDING (Transacción DB rápida y aislada)
    const order = await db.order.create({
      data: {
        total: finalAmount,
        status: "PENDING",
        customerEmail: customerData.email,
        user: { connect: { id: userId } },
        items: {
          create: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });
    console.log("📦 paymentFormData recibido:", JSON.stringify(paymentFormData, null, 2));

    const token = paymentFormData?.formData?.token;
    const payment_method_id = paymentFormData?.formData?.payment_method_id;

    if (!token || !payment_method_id) {
      return {
        success: false,
        error: `Datos de pago incompletos. Token: ${token}, Método: ${payment_method_id}`
      };
    }
    // 4. Payload MÍNIMO para Mercado Pago (sin issuer_id ni identification que rompen el sandbox)
    const paymentBody: any = {
      transaction_amount: finalAmount,
      token: paymentFormData?.formData?.token,
      installments: parseInt(paymentFormData?.formData?.installments) || 1,
      payment_method_id: paymentFormData?.formData?.payment_method_id,
      payer: {
        email: paymentFormData?.formData?.payer?.email || customerData.email
      }
    };

    // 🟢 Agregamos estos datos condicionalmente. Si el Brick los manda, los pasamos.
    if (paymentFormData?.formData?.issuer_id) {
      paymentBody.issuer_id = String(paymentFormData.formData.issuer_id);
    }
    if (paymentFormData?.formData?.payer?.identification?.number) {
      paymentBody.payer.identification = paymentFormData.formData.payer.identification;
    }

    console.log("🚀 PAYLOAD ENVIADO A MP:", JSON.stringify(paymentBody, null, 2));
    // 5. Enviar a Mercado Pago
    let mpResponse;
    try {
      mpResponse = await payment.create({
        body: paymentBody,
        requestOptions: {
          idempotencyKey: crypto.randomUUID()
        }
      });
    } catch (mpError: any) {
      console.error("🔥 Error completo de MP:", mpError);

      // Intentamos raspar cualquier error interno si es que MP nos manda algo
      const mpCausaReal = mpError.cause?.[0]?.description || mpError.message || "internal_error";

      await db.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" }
      });

      return {
        success: false,
        error: `Mercado Pago dice: ${mpCausaReal}`
      };
    }

    // 6. Finalizar proceso y descontar stock si el pago es exitoso
    if (mpResponse.status === "approved" || mpResponse.status === "in_process" || mpResponse.status === "authorized") {

      // DB: Marcamos pagado y descontamos stock real en una única transacción atómica
      await db.$transaction(async (tx) => {
        for (const item of cartItems) {
          await tx.productSize.update({
            where: { productId_size: { productId: item.id, size: item.size } },
            data: { stock: { decrement: item.quantity } }
          });
        }
        await tx.order.update({
          where: { id: order.id },
          data: { status: "PAID", paymentId: String(mpResponse.id || "") }
        });
      });

      revalidatePath("/admin/products");
      return { success: true, orderId: order.id };
    } else {
      // Si la tarjeta no tenía fondos o fue rechazada "normalmente"
      await db.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" }
      });
      return {
        success: false,
        error: `Pago no aprobado (Estado: ${mpResponse.status}). Intenta con otra tarjeta.`
      };
    }

  } catch (error: any) {
    console.error("🔥 Error interno severo en checkout:", error);
    return { success: false, error: "Ocurrió un error inesperado al procesar la compra." };
  }
}