// app/api/webhook/route.ts
import { verifyMercadoPagoSignature } from "@/app/lib/mercado-pago";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const verify = verifyMercadoPagoSignature(req);
  if (verify) return verify; // Retorna o erro se a assinatura for inválida

  const body = await req.json();
  const paymentId = body.data.id;

  // Atualizar status no banco
  await prisma.order.update({
    where: { paymentId },
    data: { status: "approved" },
  });

  return NextResponse.json({ status: "ok" });
}
