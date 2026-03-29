<<<<<<< HEAD
# GRIEF - Proyecto E-commerce

Este proyecto es una plataforma de e-commerce moderna.

## 🚀 Funcionalidades del Sistema

A continuación se presenta una descripción técnica de todas las funcionalidades que cubre el sistema, detallando tanto aquellas que ya se encuentran finalizadas como las que están pendientes de implementación o integración.

### ✅ Funcionalidades Finalizadas (Requerimientos Satisfechos)

*   **Base de Datos y ORM**: Integración de PostgreSQL utilizando Prisma ORM. Los modelos base (`Product`, `ProductSize`, `Order`, `OrderItem`, `User`, y modelos de autenticación) están definidos y son completamente funcionales.
*   **Catálogo de Productos**:
    *   Listado y visualización detallada de productos en la tienda (`/tienda`, `/tienda/[slug]`).
    *   Gestión de talles (`ProductSize`) y relación precisa de stock por talle.
    *   Componentes visuales de presentación (grillas, carruseles, hero sections).
*   **Carrito de Compras**: Implementación del estado global del carrito utilizando **Zustand**, integrado con componentes interactivos de UI (contador de carrito, botón de agregar al carrito).
*   **Autenticación de Usuarios**: Integración segura con **NextAuth**, soportando proveedores de credenciales tradicionales y proveedores OAuth externos (Google/GitHub).
*   **Panel de Administración (Dashboard)**:
    *   Rutas protegidas exclusivamente para roles de administración.
    *   Cálculo y monitoreo de KPIs en tiempo real: valor del inventario inmovilizado, cantidad de productos activos, alertas de productos sin stock y registro histórico de ingresos/ventas.
*   **Inicio de Checkout**: Base para integración de pagos con MercadoPago utilizando su SDK de React y Server Actions para iniciar el proceso de compra.

### ⏳ Funcionalidades Pendientes a Implementar

*   **Webhooks de MercadoPago (IPN)**: Creación de endpoints para recibir de manera asíncrona las confirmaciones de pago, actualizar el estado de la orden (ej. de `PENDING` a `PAID`) y asentar los movimientos.
*   **Gestión Estricta de Relaciones y Tipados (Admin)**: Refactorizar las consultas de Prisma en el panel de administrador para evitar aserciones dinámicas de tipo (`any`) asegurando que relaciones complejas (como incluir los datos del cliente en cada orden a través de `include: { user: true }`) se correspondan con los tipos generados por Prisma.
*   **Portal de Cliente (Mi Perfil/Mis Pedidos)**: Desarrollo de un área privada para los compradores donde puedan visualizar el progreso, estado e historial detallado de sus órdenes de compra.
*   **CRUD Avanzado de Productos**: Incorporar en el panel admin formularios robustos para la alta, baja y modificación de productos, integrando específicamente la capacidad de carga y manipulación de imágenes en la nube (posible integración con Supabase Storage).
*   **Validación Transaccional de Stock**: Refinar la acción de checkout para verificar y reservar atómicamente el stock exacto del talle seleccionado (`ProductSize`) justo antes de delegar el proceso al gateway de pagos, previniendo compras concurrentes sin stock.
=======
# grief
>>>>>>> 78a04bec80c4e282bb1a7fd31948a6f5ef1db3a2
