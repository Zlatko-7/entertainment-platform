import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup
    .string()
    .max(15, "Name must be at most 15 characters long")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export type SignupFormData = yup.InferType<typeof signupSchema>;
