"use server";

import { ID, Query } from "node-appwrite";
import {
  ENDPOINT,
  BUCKET_ID,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  database,
  storage,
  users
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
  const { name, email, phone } = user;
  try {
    const newUser = await users.create(
      ID.unique(),
      email,
      phone,
      undefined,
      name
    );
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal("email", [email])]);
      return documents?.users[0];
    }
    throw new Error(`An error occurred while creating a new user: ${error.message}`);
  }
}

export const getUser = async(userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error: any) {
    throw new Error(`An error occurred while retrieving the user details: ${error.message}`);
  }
}

export const registerPatient = async({ identificationDocument, ...patientData }: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }
    const patient = await database.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patientData
      }
    );
    return parseStringify(patient);
  } catch (error: any) {
    throw new Error(`An error occurred while creating a new patient: ${error.message}`);
  }
}