"use client"
import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NumericFormat } from "react-number-format";
import { createProduct } from '@/app/actions/create-product';
import { useAction } from "next-safe-action/hooks";
import { formatCentsToBRL } from '@/app/helpers/money'
 
const formSchema = z.object({
  amount: z.number({ message: "Campo obrigatório" }),
  description: z.string().min(0).optional(),
  payerEmail: z.string().optional(),
})
const FormProduct = () => {
    const { execute } = useAction(createProduct);
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      payerEmail: "",
    },
  })

  const onSubmit =  (data: z.infer<typeof formSchema>) => {
    execute({
      amount: data.amount*100,
      description: data.description,
      payerEmail: data.payerEmail
    });
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor*</FormLabel>
              <FormControl>
                <NumericFormat
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue);
                    }}
                    prefix="R$ "
                    decimalScale={2}
                    decimalSeparator=","
                    thousandSeparator="."
                    fixedDecimalScale
                    customInput={Input}
                    allowNegative={false}
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default FormProduct