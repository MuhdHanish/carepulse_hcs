"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormMessage } from "@/components/ui/form";
import { CustomFormField, EFormFieldType } from "../custom-form-field";
import { SubmitButton } from "../submit-button";
import { SelectItem } from "../ui/select";

import { getAppointmentSchema } from "@/lib/validation";
import { Doctors } from "@/constance";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";

type TAppointmentForm = {
  type: "create" | "cancel" | "schedule";
  userId: string;
  patientId: string;
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
};

export const AppointmentForm = ({
  type,
  userId,
  patientId,
  appointment,
  setOpen
}: TAppointmentForm) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  let buttonLabel;
  let status: Status;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      status = "cancelled";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      status = "pending";
      break;
    default:
      buttonLabel = "Schedule Appointment";
      status = "scheduled";
      break;
  }

  const AppointmentSchema = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician ?? "",
      reason: appointment?.reason ?? "",
      note: appointment?.note ?? "",
      schedule: appointment?.schedule ? new Date(appointment?.schedule) :new Date(Date.now()),
      cancellationReason: appointment?.cancellationReason ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof AppointmentSchema>) {
    setError("");
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
          if (appointment) {
            toast("Appointment has been created successfully", { description: formatDateTime(new Date()).dateTime });
            router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment?.$id}`);
          }
        } else {
          const appointmentToUpdate: UpdateAppointmentParams = {
            userId,
            type: type as "cancel" | "schedule",
            appointmentId: appointment?.$id!,
            appointment: {
              ...values,
              schedule: new Date(values.schedule),
              status
            }
          };
          const updatedAppointment = await updateAppointment(appointmentToUpdate);
          if (updatedAppointment) {
            toast(`Appointment has been ${type == "schedule" ? "scheduled" : "cancelled"} successfully`, { description: formatDateTime(new Date()).dateTime });
            setOpen && setOpen(false);
            form.reset();
          }
        }
      } catch (error: any) {
        setError("Something went wrong. Please try again later.");
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}
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
                placeholder="ex: Prefer afternoon appointments"
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
        <FormMessage className="shad-error" children={error} />
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
