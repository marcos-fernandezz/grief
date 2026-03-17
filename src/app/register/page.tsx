"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí conectaremos con la API para crear el usuario en Prisma
    alert("Creando cuenta para: " + formData.name);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-24">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-8 text-center">
          Únete a GRIEF®
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="NOMBRE COMPLETO" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-neutral-200 p-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-neutral-300"
            required
          />
          <input 
            type="text" 
            placeholder="EMAIL O NÚMERO DE TELÉFONO" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border border-neutral-200 p-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-neutral-300"
            required
          />
          <input 
            type="password" 
            placeholder="CREAR CONTRASEÑA" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full border border-neutral-200 p-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-neutral-300"
            required
          />
          
          <button type="submit" className="w-full bg-black text-white p-4 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors mt-2">
            Crear Cuenta
          </button>
        </form>

        <div className="w-full flex items-center gap-4 my-8">
          <div className="h-[1px] flex-1 bg-neutral-100"></div>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest">o regístrate con</span>
          <div className="h-[1px] flex-1 bg-neutral-100"></div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full border border-neutral-200 p-4 text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors">
            Google
          </button>
          <button onClick={() => alert("Próximamente: Configurar Apple Provider")} className="w-full border border-neutral-200 p-4 text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors">
            Apple
          </button>
          <button onClick={() => alert("Próximamente: Configurar Facebook Provider")} className="w-full border border-neutral-200 p-4 text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors">
            Facebook
          </button>
        </div>

        <div className="mt-12 text-[10px] uppercase tracking-widest text-neutral-500">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-black font-bold underline underline-offset-4 hover:text-neutral-600">Ingresa.</Link>
        </div>

      </div>
    </main>
  );
}