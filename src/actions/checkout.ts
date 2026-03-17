'use server';

import { db } from "../lib/db";
import { payment } from "../lib/mercadopago";
import { CartItem } from "../store/cartStore";

// Definimos la respuesta para que TypeScript no se queje
type CheckoutResponse = 
  | { success: true; orderId: string } 
  | { success: false; error: string };

export async function processOrder(
  cartItems: CartItem[], 
  customerData: any, 
  paymentFormData: any
): Promise<CheckoutResponse> {
  try {
    return await db.$transaction(async (tx) => {
      // 1. Validar Stock
      let total = 0;
      for (const item of cartItems) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product || product.stock < item.quantity) throw new Error(`Sin stock: ${item.name}`);
        total += Number(product.price) * item.quantity;
      }

      // 2. Crear Orden PENDING
      const order = await tx.order.create({
        data: {
          total,
          status: "PENDING",
          customerEmail: customerData.email,
          items: {
            create: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 3. PROCESAR PAGO (Aquí se usa la lib de Mercado Pago)
      const mpResponse = await payment.create({
        body: {
          transaction_amount: total,
          token: paymentFormData.token,
          installments: paymentFormData.installments,
          payment_method_id: paymentFormData.payment_method_id,
          payer: { email: customerData.email }
        }
      });

      if (mpResponse.status === "approved") {
        // 4. Si es exitoso, bajamos stock y marcamos como PAID
        for (const item of cartItems) {
          await tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.quantity } }
          });
        }
        await tx.order.update({ where: { id: order.id }, data: { status: "PAID" } });
        return { success: true, orderId: order.id };
      } else {
        throw new Error("El pago fue rechazado por la entidad bancaria.");
      }
    });
  } catch (error: any) {
    return { success: false, error: error.message || "Fallo en el servidor" };
  }
}