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

export const getAppointment = async (appointmentId: string) => {
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