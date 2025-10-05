"use server";
import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/lib/next-safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import z from "zod";

const inputSchema = z.object({
    amount: z.number({ message: "Campo obrigatório" }),
    description: z.string().min(0).optional(),
    payerEmail: z.string().optional(),
});

export const createProduct = actionClient
    .inputSchema(inputSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ( { parsedInput: { amount, description, payerEmail }} ) => {
        return await prisma.product.create({ data: { amount, description, payerEmail } });
    });
    revalidatePath("/product");