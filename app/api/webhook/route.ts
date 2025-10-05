// app/api/webhook/route.ts
import mpClient, { verifyMercadoPagoSignature } from "@/app/lib/mercado-pago";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    verifyMercadoPagoSignature(req);

    // Parse the request body
    const body = await req.json();
    // Extract the event type and data
    const { type, data } = body;
  
  switch (type) {
      case "payment":
        const payment = mpClient.payment; 
        const paymentData = await payment.get({ id: data.id });
        if (
          paymentData.status === "approved" || // Pagamento por cartão OU
          paymentData.date_approved !== null // Pagamento por Pix
        ) {
           // Atualizar status no banco
          await prisma.order.update({
          where: { paymentId: data.id },
          data: { status: "approved" },
          });
        }
        break;
        case "cancelled":
        case "expired":
        // Atualizar status no banco
        await prisma.order.update({
        where: { paymentId: data.id.toString() },
        data: { status: "cancelled" },
        });
        break;
      //case "subscription_preapproval": Eventos de assinatura
      //console.log("Subscription preapproval event");
      //console.log(data);
      //break;
      default:
        console.log("Unhandled event type:", type);
     }

  return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  } 
}
