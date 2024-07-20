"use client";

import { useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "../custom-form-field";
import { EFormFieldType } from "@/types";
import { SubmitButton } from "../submit-button";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Invalid phone number.",
  }),
});

export const PatientForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      console.log(values);
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hey there 👋</h1>
          <p className="text-dark-700">
            Let's make your healthcare journey smoother together.
          </p>
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
        <SubmitButton isLoading={isPending}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
