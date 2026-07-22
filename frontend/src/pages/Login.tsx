import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { RouteUrls } from "@/routes/urls";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, type LoginFormData } from "@/lib/schemas/login-schema";
import { FormInput } from "@/components/form/form-input";
import { useLoginMutation } from "@/hooks/queries/mutations/use-login-mutation";

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate(RouteUrls.movie);
        toast.success("Logged in successfully");
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Could not log in. Please try again.";
        toast.error(message);
      },
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email and password to Login.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <FormInput
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            to={RouteUrls.signup}
            className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
