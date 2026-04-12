// app/api/shipping/route.ts
export async function POST(req: Request) {
    const { zipCode } = await req.json();

    // Datos de Envíopack
    const API_KEY = process.env.ENVIOPACK_API_KEY;

    const response = await fetch(`https://api.enviopack.com/cotizar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            codigo_postal_origen: "8336", // Tu CP de Villa Regina
            codigo_postal_destino: zipCode,
            peso: 0.5, // Peso promedio de una prenda GRIEF
            paquetes: [{ alto: 5, ancho: 20, largo: 30, peso: 0.5 }]
        })
    });

    const data = await response.json();
    return Response.json(data);
}