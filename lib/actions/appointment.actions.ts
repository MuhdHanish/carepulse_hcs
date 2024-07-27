"use server";

import { ID, Query } from "node-appwrite";
import {
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  database,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async ({ ...appointmentData }: CreateAppointmentParams): Promise<Appointment> => {
  try {
    const appointment = await database.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      { ...appointmentData }
    );
    revalidatePath(`/admin`);
    return parseStringify(appointment);
  } catch (error: any) {
    throw new Error(`An error occurred while creating a new appointment: ${error.message}`);
  }
}

export const updateAppointment = async ({ userId, type, appointmentId, appointment }: UpdateAppointmentParams): Promise<Appointment> => {
  try {
    const updatedAppointment = await database.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    if (!updatedAppointment) throw new Error(
      `Failed to update appointment with ID ${appointmentId}. The appointment could not be found or updated.`
    );

    let messageContent = "";
    switch (type) {
      case "schedule":
        messageContent = `This is from Carepulse,
Your appointment with Dr. ${appointment?.primaryPhysician} has been scheduled for ${formatDateTime(appointment?.schedule)?.dateTime}.
If you have any questions, please contact us.`;
        break;
      case "cancel":
        messageContent = `This is from Carepulse,
We regret to inform you that your appointment with Dr. ${appointment?.primaryPhysician}, scheduled for ${formatDateTime(appointment?.schedule)?.dateTime}, has been canceled.
${appointment?.cancellationReason && `Reason for cancellation: ${appointment?.cancellationReason}`}
If you have any questions or need to reschedule, please contact us. We apologize for any inconvenience this may have caused.`;
        break;
      default:
        messageContent = `This is from Carepulse,
Your appointment with Dr.  ${appointment?.primaryPhysician} on ${formatDateTime(appointment?.schedule)?.dateTime} has been updated.
If you have any questions, please contact us.`;
        break;
    }
    await sendSMSNotification(userId, messageContent);

    revalidatePath(`/admin`);
    return parseStringify(updatedAppointment);
  } catch (error: any) {
    throw new Error(`An error occurred while updating a appointment: ${error.message}`);
  }
}

const sendSMSNotification = async (userId: string, content: string) => {
  try {
    await messaging.createSms(ID.unique(), content, [], [userId]);
  } catch (error: any) {
    throw new Error(`An error occurred while sending sms notification: ${error.message}`);
  }
}

export const getAppointment = async (appointmentId: string): Promise<Appointment> => {
  try {
    const appointment = await database.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error: any) {
    throw new Error(`An error occurred while retrieving the appointment details: ${error.message}`);
  }
}

type TInitialCounts = {
  [K in Status]: number;
};

export type TGetRecentAppointmentsReturn = {
  total: number,
  appointments: Appointment[]
} & TInitialCounts;

export const getRecentAppointmentsList = async (): Promise<TGetRecentAppointmentsReturn> => {
  try {
    const { documents, total }: { documents: Appointment[]; total: number; } = await database.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );
    const initialCounts: TInitialCounts = {
      scheduled: 0,
      pending: 0,
      cancelled: 0
    };
    const counts = documents?.reduce((acc, appointment) => {
      if (appointment?.status === "pending") acc.pending += 1;
      else if (appointment?.status === "scheduled") acc.scheduled += 1;
      else if (appointment?.status === "cancelled") acc.cancelled += 1;
      return acc;
    }, initialCounts);
    const data = {
      total,
      appointments: documents,
      ...counts
    };
    return parseStringify(data);
  } catch (error: any) {
    throw new Error(`An error occurred while retrieving the recent appointments details: ${error.message}`);
  }
}