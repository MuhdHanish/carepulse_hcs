"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Appointment } from "@/types/appwrite.types";
import { AppointmentForm } from "../forms/appointment-form";

type TAppointmentModalProps = {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment: Appointment;
  title: string;
  description: string;
};

export const AppointmentModal = ({ type, patientId, userId, appointment, title, description }: TAppointmentModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className={`capitalize ${type === "schedule" && "text-green-500"}`}>{type}</Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-lg">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize sub-header">{title}</DialogTitle>
          <DialogDescription className="text-dark-700">{description}</DialogDescription>
        </DialogHeader>
        <AppointmentForm
          patientId={patientId}
          userId={userId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>

  );
}
