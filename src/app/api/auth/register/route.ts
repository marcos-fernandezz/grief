import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; 

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, identifier, password } = body;

        // 1. Validar que vengan los datos
        if (!identifier || !password) {
            return NextResponse.json({ message: "Faltan datos obligatorios." }, { status: 400 });
        }

        // 2. Determinar si el identificador es un email o un teléfono (forma simple: buscando el @)
        const isEmail = identifier.includes("@");
        const email = isEmail ? identifier : null;
        const phone = !isEmail ? identifier : null;

        // 3. Verificar si el usuario ya existe para no duplicarlo
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({ message: "Ya existe una cuenta con este email o teléfono." }, { status: 409 });
        }

        // 4. Encriptar la contraseña (NUNCA guardar en texto plano)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Guardar el nuevo usuario en Supabase
        const newUser = await db.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
            }
        });

        return NextResponse.json({ message: "Usuario creado con éxito.", user: newUser }, { status: 201 });

    } catch (error) {
        console.error("Error en registro:", error);
        return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
    }
}