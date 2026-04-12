// src/lib/mercadopago.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';

// 🟢 Esto corre solo en el SERVIDOR (Node.js)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export const payment = new Payment(client);