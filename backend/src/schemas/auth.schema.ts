import * as z from "zod";

export const signupSchema = z.object({
  name: z.string().max(15, {
    message: "Name must be at most 15 characters long",
  }),
  email: z.email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export const loginSchema = z.object({
  email: z.email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});
