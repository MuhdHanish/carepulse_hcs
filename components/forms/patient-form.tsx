"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { CustomFormField, EFormFieldType } from "../custom-form-field";
import { SubmitButton } from "../submit-button";
import { UserFormValidation } from "@/lib/validation";
import { createUser } from "@/lib/actions/patient.actions";

export const PatientForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof UserFormValidation>) {
    startTransition(async () => {
      try {
        const user = await createUser(values);
        if (user) router.push(`/patients/${user?.$id}/register`);
      } catch (error) {
        console.error(error);
      }
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
}
