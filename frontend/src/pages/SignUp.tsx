import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FormInput } from "@/components/form/form-input";
import { signupSchema, type SignupFormData } from "@/lib/schemas/signup-schema";

export default function SignUp() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (values: SignupFormData) => {
      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message ?? "Could not create account. Please try again."
        );
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Could not create account. Please try again.";
      toast.error(message);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to get started.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit((data) => signupMutation.mutate(data))}
          className="space-y-4"
        >
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Jane Doe"
            type="text"
          />

          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
          />

          <FormInput
            control={control}
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Creating account…" : "Sign up"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Back to Login{" "}
          <Link
            to={"/login"}
            className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
