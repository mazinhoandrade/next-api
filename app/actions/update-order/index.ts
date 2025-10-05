import { prisma } from "@/app/lib/prisma"

export const updateStatus = async (paymentId: string, status: string) => {
    await prisma.order.update({
        where: { paymentId },
        data: { status },
    })
}