import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getCurrentUser, login as loginUser } from "../API/auth";
import { Button, Logo, Input } from "../components/index";
import { useAuth } from "../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const { setUser } = useAuth();

  const onSubmit = async (data) => {
    setError("");
    try {
      const response = await loginUser(data.email, data.password);
      console.log("Login success:", response);

      const current = await getCurrentUser();
      setUser(current.data.user);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
        <div className="mb-6 flex justify-center">
          <span className="w-24">
            <Logo width="100%" />
          </span>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline transition duration-200"
          >
            Sign Up
          </Link>
        </p>

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />

          <Button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 rounded-lg"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
