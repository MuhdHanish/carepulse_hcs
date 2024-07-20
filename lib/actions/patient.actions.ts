import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

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
  }
};
