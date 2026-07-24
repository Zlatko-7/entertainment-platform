import * as z from "zod";

const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(15, "Name must be at most 15 characters long")
    .regex(namePattern, "Name can only contain letters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters long"),
});
