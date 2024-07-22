"use server";

import { ID, Query } from "node-appwrite";
import {
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  database,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";

export const createAppointment = async ({ ...appointmentData }: CreateAppointmentParams): Promise<Appointment> => {
  try {
    const appointment = await database.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      { ...appointmentData }
    );
    return parseStringify(appointment);
  } catch (error: any) {
    throw new Error(`An error occurred while creating a new appointment: ${error.message}`);
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