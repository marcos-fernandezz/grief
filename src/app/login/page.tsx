"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function AuthContent() {
  const [isRegistering, setIsRegistering] = useState(false);

  const [authData, setAuthData] = useState({
    identifier: "",
    password: "",
    name: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // Limpiamos errores
    setIsLoading(true); // ⏱️ PRENDEMOS EL LOADING

    if (isRegistering) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(authData),
        });
        const data = await res.json();

        if (res.ok) {
          const signInRes = await signIn("credentials", {
            redirect: false,
            identifier: authData.identifier,
            password: authData.password,
          });
          if (signInRes?.ok) {
            window.location.href = "/admin";
          } else {
            setErrorMsg("Cuenta creada, pero hubo un error al iniciar sesión.");
            setIsLoading(false); // 🛑 APAGAMOS EN ERROR
          }
        } else {
          setErrorMsg(data.message);
          setIsLoading(false); // 🛑 APAGAMOS EN ERROR
        }
      } catch (error) {
        setErrorMsg("Error de conexión con el servidor.");
        setIsLoading(false); // 🛑 APAGAMOS EN ERROR
      }
    } else {
      // --- LÓGICA DE LOGIN MANUAL ---
      const res = await signIn("credentials", {
        redirect: false,
        identifier: authData.identifier,
        password: authData.password,
      });

      setIsLoading(false); // 🛑 APAGAMOS A PENAS RESPONDE

      if (res?.error) {
        setErrorMsg(res.error);
      } else if (res?.ok) {
        window.location.href = "/admin";
      }
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      {errorMsg && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200 animate-in slide-in-from-top-4 fade-in duration-300 min-w-[320px] w-max">
          {/* Línea roja lateral de acento */}
          <div className="absolute left-0 top-0 w-1 h-full bg-red-600"></div>

          {/* Ícono de Alerta */}
          <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>

          {/* Mensaje de Error */}
          <p className="text-[10px] uppercase tracking-widest text-black font-bold flex-1">
            {errorMsg}
          </p>

          {/* Botón de cerrar manual */}
          <button type="button" onClick={() => setErrorMsg("")} className="text-neutral-400 hover:text-black transition-colors">
            <IoClose size={18} />
          </button>
        </div>
      )}
      {/* --- PANEL DE LOGIN (BASE) --- */}
      <div className={`transition-all duration-500 ${isRegistering ? 'blur-sm opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] mb-12 text-center">
          Accede a tu cuenta de GRIEF®
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="email o teléfono"
            onChange={(e) => setAuthData({ ...authData, identifier: e.target.value })}
            // Tailwind Magic: Fuerza el color gris del placeholder y lo hace transparente al enfocar
            className="w-full border border-neutral-200 p-4 text-[10px] uppercase tracking-widest text-black placeholder:text-neutral-400 focus:placeholder:text-transparent focus:outline-none focus:border-black transition-colors"
          />
          <input
            type="password"
            placeholder="contraseña"
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            className="w-full border border-neutral-200 p-4 text-[10px] uppercase tracking-widest text-black placeholder:text-neutral-400 focus:placeholder:text-transparent focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black text-white p-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'}`}
          >
            {isLoading ? "Procesando..." : (isRegistering ? "Completar Registro" : "Iniciar Sesión")}
          </button>
        </form>

        <div className="w-full flex items-center gap-4 my-10">
          <div className="h-[1px] flex-1 bg-neutral-100"></div>
          <span className="text-[9px] text-neutral-300 uppercase tracking-widest">o entra con</span>
          <div className="h-[1px] flex-1 bg-neutral-100"></div>
        </div>

        <div className="flex justify-center items-center gap-10 w-full mb-12">
          {/* Google - Rojo Google */}
          <button onClick={() => signIn("google", { callbackUrl: "/admin" })} type="button" className="hover:scale-110 transition-all duration-300">
            <FaGoogle className="text-xl text-neutral-400 hover:text-[#EA4335] transition-colors duration-300" />
          </button>

          {/* Facebook - Azul Facebook */}
          <button onClick={() => signIn("facebook", { callbackUrl: "/admin" })} type="button" className="hover:scale-110 transition-all duration-300">
            <FaFacebook className="text-xl text-neutral-400 hover:text-[#1877F2] transition-colors duration-300" />
          </button>
        </div>

        <div className="text-center text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          ¿Aún no has iniciado sesión?
          <button onClick={() => setIsRegistering(true)} type="button" className="text-black font-bold underline underline-offset-8 ml-2">Regístrate.</button>
        </div>
      </div>

      {/* --- PANEL DE REGISTRO (POR ENCIMA) --- */}
      {isRegistering && (
        <div className="absolute inset-0 bg-white z-10 flex flex-col animate-in fade-in zoom-in duration-300">
          <button onClick={() => setIsRegistering(false)} type="button" className="self-end mb-4 text-neutral-400 hover:text-black">
            <IoClose size={24} />
          </button>

          <p className="text-black text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-center">
            Crea tu perfil en GRIEF®
          </p>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="nombre completo"
              onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
              className="w-full border border-black p-4 text-[10px] uppercase tracking-widest text-black placeholder:text-neutral-500 focus:placeholder:text-transparent outline-none focus:bg-neutral-50 transition-colors"
            />
            <input
              type="text"
              placeholder="email o teléfono"
              onChange={(e) => setAuthData({ ...authData, identifier: e.target.value })}
              className="w-full border border-black p-4 text-[10px] uppercase tracking-widest text-black placeholder:text-neutral-500 focus:placeholder:text-transparent outline-none focus:bg-neutral-50 transition-colors"
            />
            <input
              type="password"
              placeholder="contraseña"
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              className="w-full border border-black p-4 text-[10px] uppercase tracking-widest text-black placeholder:text-neutral-500 focus:placeholder:text-transparent outline-none focus:bg-neutral-50 transition-colors"
            />
            <button type="submit" className="w-full bg-black text-white p-4 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors mt-4">
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
      <Suspense fallback={<div className="text-[10px] uppercase tracking-widest">Cargando...</div>}>
        <AuthContent />
      </Suspense>
    </main>
  );
}