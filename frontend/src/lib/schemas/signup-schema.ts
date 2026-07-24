import * as yup from "yup";

const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

export const signupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(15, "Name must be at most 15 characters long")
    .matches(namePattern, "Name can only contain letters"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type SignupFormData = yup.InferType<typeof signupSchema>;
