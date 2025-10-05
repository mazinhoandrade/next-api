import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ⚠️ Secret configurado no Mercado Pago
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text(); // precisamos do body "bruto" para validar
    const signatureHeader = req.headers.get("x-signature") || "";
    const requestId = req.headers.get("x-request-id") || "";

    if (!signatureHeader || !requestId) {
      return NextResponse.json({ error: "Headers ausentes" }, { status: 400 });
    }

    // Validar assinatura
    const [ts, signatureHash] = signatureHeader.split(",").map((x) => x.split("=")[1]);
    const payload = `${ts}.${requestId}.${rawBody}`;
    const expectedHash = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    if (expectedHash !== signatureHash) {
      console.log("❌ Assinatura inválida", { expectedHash, signatureHash });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = JSON.parse(rawBody);

    // O ID do pagamento vem em data.id
    const paymentId = data.data.id;
    const status = data.data.status; // ex: "approved", "pending", "rejected"

    // Atualizar pedido no Neon/PostgreSQL
    const order = await prisma.order.update({
      where: { paymentId: String(paymentId) },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Pedido atualizado:", order);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno"}, { status: 500 });
  }
}
