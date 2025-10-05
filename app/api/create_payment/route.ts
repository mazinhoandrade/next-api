import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import MercadoPago from "mercadopago";

// Prisma
const prisma = new PrismaClient();

// Mercado Pago client (SDK moderno 2.x)
const mpClient = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! });


interface MercadoPagoPayment {
  id: number | string;
  status: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description } = body as {
      amount: number;
      description?: string;
    };

    if (!amount) {
      return NextResponse.json({ error: "amount é obrigatório" }, { status: 400 });
    }

    // Criar pagamento PIX via Payments API
const payment = await (mpClient as unknown as { payment: { create: (arg0: { transaction_amount: number; payment_method_id: string; payer: { email: string; }; description: string; }) => Promise<MercadoPagoPayment> } })
  .payment.create({
    transaction_amount: amount,
    payment_method_id: "pix",
    payer: { email: "payer@example.com" },
    description: "Pagamento via PIX",
  });

    // Extrair dados PIX
    const point = payment.point_of_interaction?.transaction_data;
    if (!point) {
      return NextResponse.json({ error: "Erro ao gerar QR Code PIX" }, { status: 500 });
    }

    // Salvar pedido no Neon/PostgreSQL via Prisma
    const order = await prisma.order.create({
      data: {
        paymentId: String(payment.id),
        amount,
        description: description || "Pagamento via PIX",
        status: payment.status,
        qrCode: point.qr_code,
        qrCodeBase64: point.qr_code_base64,
        paymentUrl: point.ticket_url,
      },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno"}, { status: 500 });
  }
}
