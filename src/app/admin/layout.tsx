import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Forzamos el fondo negro y texto blanco para toda la zona de administración
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white/20">
      {/* Aquí inyectamos tu Navbar oscuro */}
      <AdminNavbar />
      
      {/* Todo el contenido (Dashboard, Productos, etc.) irá aquí adentro */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}