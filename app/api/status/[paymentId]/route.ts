// app/api/status/[paymentId]/route.ts

import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  paymentId: string;
}

export async function GET(req: Request, context: { params: Params }) {
  const { params } = context;
  const { paymentId } = params;

  const order = await prisma.order.findUnique({
    where: { paymentId },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  return NextResponse.json(order);
}
