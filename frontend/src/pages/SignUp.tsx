import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { useSignupMutation } from "@/hooks/queries/mutations/use-signup-mutation";

export default function SignUp() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const { control, handleSubmit } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: SignupFormData) {
    signupMutation.mutate(data, {
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
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to get started.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
