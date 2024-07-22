"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "../status-badge";
import { Appointment } from "@/types/appwrite.types";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constance";
import Image from "next/image";
import { AppointmentModal } from "../modals/appointment-modal";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.original?.patient?.name}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original?.status} />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original?.schedule)?.dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doctor) => doctor?.name === row.original?.primaryPhysician
      );
      return (
        <div className="flex items-center gap-3">
          {doctor?.image && (
            <Image
              src={doctor?.image!}
              alt="doctor-image"
              width={100}
              height={100}
              className="size-8"
            />
          )}
          {doctor?.name && (
            <p className="whitespace-nowrap">Dr. {doctor?.name!}</p>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: appointment } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId={appointment?.patient?.$id}
            userId={appointment?.userId}
            appointment={appointment}
            title="Schedule Appointment"
            description="Please fill in the following details to schedule."
          />
          <AppointmentModal
            type="cancel"
            patientId={appointment?.patient?.$id}
            userId={appointment?.userId}
            appointment={appointment}
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment ?"
          />
        </div>
      );
    },
  },
];
