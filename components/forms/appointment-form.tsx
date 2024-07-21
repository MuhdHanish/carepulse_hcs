"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { CustomFormField, EFormFieldType } from "../custom-form-field";
import { SubmitButton } from "../submit-button";
import { SelectItem } from "../ui/select";

import { getAppointmentSchema } from "@/lib/validation";
import { Doctors } from "@/constance";
import { createAppointment } from "@/lib/actions/appointment.actions";

type TAppointmentForm = {
  type: "create" | "cancel" | "schedule";
  userId: string;
  patientId: string;
};

export const AppointmentForm = ({
  type,
  userId,
  patientId,
}: TAppointmentForm) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  let buttonLabel;
  let status: Status;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel appointment";
      status = "cancelled";
      break;
    case "create":
      buttonLabel = "Create appointment";
      status = "pending";
      break; 
    default:
      buttonLabel = "Schedule appointment";
      status = "scheduled";
      break;
  }

  const AppointmentSchema = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      primaryPhysician: "",
      reason: "",
      note: "",
      schedule: new Date(Date.now()),
      cancellationReason: "",
    },
  });

  function onSubmit(values: z.infer<typeof AppointmentSchema>) {
    startTransition(async () => {
      try {
        if (type === "create" && patientId) {
          const appointmentData: CreateAppointmentParams = {
            userId,
            patient: patientId,
            ...values,
            reason: values.reason!,
            schedule: new Date(values.schedule),
            status
          };
          const appointment = await createAppointment(appointmentData);
          if (appointment) router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment?.$id}`);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds.
          </p>
        </section>
        {type !== "cancel" ? (
          <>
            <CustomFormField
              control={form.control}
              fieldType={EFormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, index) => (
                <SelectItem
                  key={`${doctor?.name}-${index}`}
                  value={doctor?.name}
                >
                  <div className="flex cursor-pointer items-center gap-2">
                    {doctor?.image && (
                      <Image
                        src={doctor?.image}
                        width={32}
                        height={32}
                        alt={doctor?.name ?? "doctor-image"}
                        className="rounded-full"
                      />
                    )}
                    <p>{doctor?.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                fieldType={EFormFieldType.TEXTAREA}
                name="reason"
                label="Reason for appointment"
                placeholder="ex: Annual montly check-up"
              />
              <CustomFormField
                control={form.control}
                fieldType={EFormFieldType.TEXTAREA}
                name="note"
                label="Additional comments/notes"
                placeholder="ex: Prefer afternoon appointments, if possible"
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={EFormFieldType.DATE_PICKER}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />
          </>
        ) : (
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="ex: Urgent meeting came up"
          />
        )}
        <SubmitButton
          isLoading={isPending}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
