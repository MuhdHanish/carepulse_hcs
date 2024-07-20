import { z } from "zod";

export const patientFormSchema = z.object({
  name: z.string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, "Name must be at most 50 characters."),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Invalid phone number.",
  }),
});
