# Reporte de Requerimientos del Proyecto GRIEF

Tras analizar el código fuente en el directorio del proyecto, a continuación se detallan los requerimientos satisfechos (funcionalidades implementadas) y los requerimientos pendientes (basado en implementaciones incompletas, comentarios u omisiones típicas de e-commerce detectadas en el código).

## 1. Requerimientos Satisfechos (Funcionales)

*   **Base de Datos y ORM**: Integración de PostgreSQL utilizando Prisma ORM. Los modelos base (`Product`, `ProductSize`, `Order`, `OrderItem`, `User`, y modelos de Auth) están definidos y funcionales en `schema.prisma`.
*   **Catálogo de Productos**:
    *   Listado y visualización de productos en la tienda (`/tienda`, `/tienda/[slug]`).
    *   Gestión de talles (`ProductSize`) y relación de stock por talle.
    *   Componentes visuales de grilla y carrusel (`Carrusel.tsx`, `Hero.tsx`).
*   **Carrito de Compras**: Implementación del estado global del carrito utilizando `Zustand` (`store/cartStore.tsx`), en conjunto con componentes de UI como `CartCounter.tsx` y `AddToCartButton.tsx`.
*   **Autenticación de Usuarios**: Integración de NextAuth (`@auth/prisma-adapter`) con modelos de tabla preparados para credenciales y proveedores externos (Google/GitHub), soportado por las rutas `/login`, `/register` y la carpeta `api/auth`.
*   **Panel de Administración (Dashboard)**:
    *   Rutas protegidas para administración (`/admin`, `/admin/products`).
    *   Cálculo de KPIs en tiempo real: Valor del inventario inmovilizado, cantidad de productos activos, conteo de productos sin stock y registro histórico de ventas.
*   **Integración de Pagos (Parcial)**: Dependencias instaladas para MercadoPago (`mercadopago`, `@mercadopago/sdk-react`) y acciones de checkout iniciadas (`actions/checkout.ts`).

## 2. Requerimientos Pendientes

A pesar de no contar con etiquetas "TODO" explícitas en comentarios, la revisión de la estructura detectó los siguientes requerimientos como pendientes de desarrollo, refactorización o integración:

*   **Webhooks de MercadoPago (IPN)**: Aunque está el SDK y el modelo `Order` con `paymentId`, no existe un endpoint en `api/` (ej. `api/webhooks/mercadopago`) para recibir las notificaciones asíncronas de pago y actualizar automáticamente el estado (de `PENDING` a `PAID`) y descontar el stock.
*   **Corrección de Tipados y Relaciones de Órdenes (Admin)**: 
    *   En `src/app/admin/page.tsx`, la consulta de órdenes utiliza tipado dinámico bypass (`await (db as any).order.findMany(...)`) y asume propiedades no garantizadas. 
    *   Intenta renderizar `order.customerName`, sin embargo, el modelo `Order` actual de Prisma solo enlaza `userId` y no tiene un campo directo `customerName` accesible sin usar `include: { user: true }`.
*   **Perfil de Usuario y Mis Compras**: No existen rutas para que los clientes finales puedan ver el estado de sus pedidos (ej. `/profile` o `/mis-compras`). El historial de órdenes solo es visible en el administrador.
*   **Gestión CRUD de Productos en Interfaz Admin**: Existe la ruta `/admin/products` pero, usualmente, un ecommerce requiere componentes completos de formulario con subida de imágenes para crear y editar productos (posiblemente falta la integración de almacenamiento en la nube, aunque `supabase` está en el package.json).
*   **Validación de Checkout Fuerte**: Terminar la lógica de `actions/checkout.ts` asegurando que al momento de la compra exista el `stock` suficiente en `ProductSize` antes de generar la preferencia de pago.
