import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { register as registerUser } from "../API/auth";
import { Button, Input, Logo } from "../components/index";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setError("");
    try {
      // backend expects: username, password, email, fullname, role
      const response = await registerUser(
        data.username,
        data.password,
        data.email,
        data.fullname,
        data.role || "customer"
      );

      console.log("Registration success:", response);
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex justify-center mb-4">
          <Logo width="80px" />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Sign up to create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            {...register("fullname", { required: "Full name is required" })}
          />
          <Input
            label="Username"
            placeholder="Enter your username"
            {...register("username", { required: "Username is required" })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Please enter a valid email address",
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
