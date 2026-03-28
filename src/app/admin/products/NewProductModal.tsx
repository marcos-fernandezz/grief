"use client";
import { useState, useEffect } from "react";
import { Plus, X, Upload } from "lucide-react";
import { createProduct } from "@/actions/products"; 
import SizeManager from "@/components/admin/SizeManager"; // Asegurate de que la ruta sea correcta

export default function NewProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [formValues, setFormValues] = useState({
    name: "",
    slug: "",
    price: "",
    category: "",
    description: ""
  });

  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Control del scroll del body al abrir el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("slug", formValues.slug);
    formData.append("price", formValues.price);
    formData.append("category", formValues.category);
    formData.append("description", formValues.description);
    
    // 🟢 Inyectamos el JSON de talles que viene del componente SizeManager
    formData.append("sizes", JSON.stringify(sizes));
    
    // 🟢 Adjuntamos las imágenes seleccionadas
    selectedFiles.forEach(file => {
      formData.append("images", file);
    });

    try {
      const result = await createProduct(formData);

      if (result.success) {
        // Reset total del estado
        setFormValues({ name: "", slug: "", price: "", category: "", description: "" });
        setSizes([]);
        setSelectedFiles([]);
        setIsOpen(false);
      } else {
        alert("Error al crear producto: " + result.error);
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón de Apertura */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-200 transition-all border border-white"
      >
        <Plus size={14} strokeWidth={3} />
        Añadir Producto
      </button>

      {/* Modal / Sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[999] flex justify-end bg-black/90 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)} 
        >
          <div 
            className="relative w-full max-w-lg bg-black border-l border-white/10 h-full overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header Sticky */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center z-20">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                Gestión de Inventario
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8 pb-32">
              
              {/* Sección: Información Básica */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Nombre del Producto</label>
                  <input 
                    name="name" 
                    value={formValues.name}
                    onChange={handleChange}
                    placeholder="E.g. VOID HOODIE" 
                    className="bg-neutral-900/50 p-4 border border-white/10 text-sm text-white focus:outline-none focus:border-white/40 transition-all" 
                    required 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">URL Slug</label>
                  <input 
                    name="slug" 
                    value={formValues.slug}
                    onChange={handleChange}
                    placeholder="void-hoodie-01" 
                    className="bg-neutral-900/50 p-4 border border-white/10 text-sm text-white font-mono focus:outline-none focus:border-white/40 transition-all" 
                    required 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Descripción del Concepto</label>
                  <textarea 
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    rows={3}
                    className="bg-neutral-900/50 p-4 border border-white/10 text-sm text-white focus:outline-none focus:border-white/40 resize-none transition-all"
                  />
                </div>
              </div>

              {/* Sección: Precio y Categoría */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Precio (ARS)</label>
                  <input 
                    name="price" 
                    type="number" 
                    value={formValues.price}
                    onChange={handleChange}
                    placeholder="0.00" 
                    className="bg-neutral-900/50 p-4 border border-white/10 text-sm text-white font-mono focus:outline-none focus:border-white/40" 
                    required 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Categoría</label>
                  <select 
                    name="category"
                    value={formValues.category}
                    onChange={handleChange}
                    className="bg-neutral-900/50 p-4 border border-white/10 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-white/40 uppercase tracking-tighter"
                    required
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="TOPS">Tops</option>
                    <option value="BOTTOMS">Bottoms</option>
                    <option value="ACCESSORIES">Accesorios</option>
                  </select>
                </div>
              </div>

              {/* 🟢 SECCIÓN: TALLLES (SIZE MANAGER) */}
              <SizeManager onChange={setSizes} />

              {/* Sección: Multimedia */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Imágenes del Drop</label>
                <input 
                  id="image-upload"
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required={selectedFiles.length === 0}
                />
                <label 
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center gap-4 bg-neutral-900/30 border-2 border-dashed border-white/10 p-10 cursor-pointer hover:border-white/30 transition-all group"
                >
                  <Upload className="text-neutral-600 group-hover:text-white transition-colors" size={32} />
                  <div className="text-center">
                    <p className="text-sm text-white font-medium">
                      {selectedFiles.length > 0 
                        ? `${selectedFiles.length} archivos seleccionados` 
                        : "Seleccionar archivos"}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase mt-1 tracking-widest">
                      Formato recomendado: Vertical (3:4)
                    </p>
                  </div>
                </label>
              </div>

              {/* Botón de Acción Principal */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-black py-6 uppercase tracking-[0.3em] text-xs hover:bg-neutral-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed sticky bottom-0 z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]"
              >
                {loading ? "Sincronizando..." : "Publicar Producto"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}