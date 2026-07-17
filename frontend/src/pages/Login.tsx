import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "@/auth/useAuth";
import { RouteUrls } from "@/routes/urls";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, type LoginFormData } from "@/lib/schemas/login-schema";
import { FormInput } from "@/components/form/form-input";

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { getUser } = useUser();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: LoginFormData) {
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message ?? "Invalid email or password");
      }

      await res.json();

      // CURSOR: AWAIT getUser() BEFORE navigate("/") SO PRIVATE ROUTES RENDER WITH user SET
      await getUser();
      navigate(RouteUrls.movie);
      toast.success("Logged in successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not log in. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
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

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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
