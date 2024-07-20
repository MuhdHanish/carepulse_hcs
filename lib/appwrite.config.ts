import * as appwriteSdk from "node-appwrite";

export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_STORAGE_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

const appwriteClient = new appwriteSdk.Client();

appwriteClient
  .setEndpoint(ENDPOINT!)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!);

const database = new appwriteSdk.Databases(appwriteClient);
const storage = new appwriteSdk.Storage(appwriteClient);
const messaging = new appwriteSdk.Messaging(appwriteClient);
const users = new appwriteSdk.Users(appwriteClient);

export { database, storage, users, messaging };