"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Icono para cerrar el panel

function AuthContent() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí la lógica: si isRegistering es false, solo validamos.
    // Si es true, disparamos la creación en la DB.
    alert(isRegistering ? "Creando cuenta..." : "Validando usuario...");
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* --- PANEL DE LOGIN (BASE) --- */}
      <div className={`transition-all duration-500 ${isRegistering ? 'blur-sm opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] mb-12 text-center">
          Accede a tu cuenta de GRIEF®
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="EMAIL O NÚMERO DE TELÉFONO" 
            className="w-full border border-neutral-200 p-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
          />
          <input 
            type="password" 
            placeholder="CONTRASEÑA" 
            className="w-full border border-neutral-200 p-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
          />
          <button className="w-full bg-black text-white p-4 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
            Iniciar Sesión
          </button>
        </form>

        <div className="w-full flex items-center gap-4 my-10">
          <div className="h-[1px] flex-1 bg-neutral-100"></div>
          <span className="text-[9px] text-neutral-300 uppercase tracking-widest">o entra con</span>
          <div className="h-[1px] flex-1 bg-neutral-100"></div>
        </div>

        <div className="flex justify-center gap-10 w-full mb-12">
          <button onClick={() => signIn("google", { callbackUrl: "/admin" })} type="button" className="hover:scale-110 transition-transform">
            <FaGoogle className="text-xl text-neutral-400 hover:text-red-500"/>
          </button>
          <button className="hover:scale-110 transition-transform"><FaApple className="text-2xl text-neutral-400 hover:text-black"/></button>
          <button className="hover:scale-110 transition-transform"><FaFacebook className="text-xl text-neutral-400 hover:text-blue-600"/></button>
        </div>

        <div className="text-center text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          ¿Aún no has iniciado sesión? 
          <button onClick={() => setIsRegistering(true)} className="text-black font-bold underline underline-offset-8 ml-2">Regístrate.</button>
        </div>
      </div>

      {/* --- PANEL DE REGISTRO (POR ENCIMA) --- */}
      {isRegistering && (
        <div className="absolute inset-0 bg-white z-10 flex flex-col animate-in fade-in zoom-in duration-300">
          <button onClick={() => setIsRegistering(false)} className="self-end mb-4 text-neutral-400 hover:text-black">
            <IoClose size={24} />
          </button>
          
          <p className="text-black text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-center">
            Crea tu perfil en GRIEF®
          </p>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <input type="text" placeholder="NOMBRE COMPLETO" className="w-full border border-black p-4 text-[10px] uppercase tracking-widest outline-none" />
            <input type="email" placeholder="EMAIL" className="w-full border border-black p-4 text-[10px] uppercase tracking-widest outline-none" />
            <input type="password" placeholder="CONTRASEÑA" className="w-full border border-black p-4 text-[10px] uppercase tracking-widest outline-none" />
            <button className="w-full bg-black text-white p-4 text-[10px] font-bold uppercase tracking-widest mt-4">
              Completar Registro
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <Suspense fallback={<div>Cargando...</div>}>
        <AuthContent />
      </Suspense>
    </main>
  );
}