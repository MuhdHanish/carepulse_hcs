"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { CustomFormField } from "../custom-form-field"
import { EFormFieldType } from "@/types"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

export const PatientForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hey there 👋</h1>
          <p className="text-dark-700">Let's make your healthcare journey smoother together.</p>
        </section>
        <CustomFormField
          control={form.control} 
          fieldType={EFormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="Jhon Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user-icon"
          />
        <CustomFormField
          control={form.control} 
          fieldType={EFormFieldType.INPUT}
          name="email"
          label="Email address"
          placeholder="jhonedoe@example.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email-icon"
          />
        <CustomFormField
          control={form.control} 
          fieldType={EFormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone number"
          placeholder="(999) 999-999"
          />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

  )
}
