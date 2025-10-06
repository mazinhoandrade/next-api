// app/api/create_order/route.ts
import { NextRequest, NextResponse } from "next/server";


import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import { Order } from "@/app/types/order";

import { getProductId, getProducts } from "@/app/actions/get-product";


export async function POST(req: NextRequest) {
  try {
    //const { amount, payerEmail, description } = await req.json() as CreateOrderBody;
    const product = await getProducts();
    if (!product[0].amount) {
      return NextResponse.json({ error: "Produto nao encontrado" }, { status: 404 });
    }
    const amount = product[0].amount/100;
    const description = product[0].description;
    const payerEmail = product[0].payerEmail;
    const external_reference = `pedido_${crypto.randomUUID()}`;
    if (!amount || !external_reference) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const idempotencyKey = crypto.randomUUID();
    const expiration = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // ⏱️ expira em 10 minutos
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        transaction_amount: amount,
        description: description || "Pedido PIX",
        payment_method_id: "pix",
        payer: { email: payerEmail || "mazinhodev@example.com" },
        external_reference: external_reference,
        date_of_expiration: expiration,
      }),
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error("Erro Mercado Pago:", orderData);
      return NextResponse.json({ error: "Erro na criação do pagamento", detail: orderData }, { status: 500 });
    }

    // Salvar no banco
    const order = await prisma.order.create({
      data: {
        paymentId: orderData.id.toString(),
        amount: amount,
        description: "Pedido PIX",
        status: orderData.status,
        paymentUrl: orderData.point_of_interaction?.transaction_data?.ticket_url,
        qrCode: orderData.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: orderData.point_of_interaction?.transaction_data?.qr_code_base64,
      },
    }) as Order;

    return NextResponse.json(order);
  } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
