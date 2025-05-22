"use client";

import { updateToken, updateUser, userRole } from "@/lib/features/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const formSchema = z.object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
    password: z
      .string()
      .trim()
      .min(1, "Password is required.")
      .min(6, "Password must be at least 6 characters long."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (model) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(model),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Login failed");
        setLoading(false);
        return;
      }

      const data = await response.json();
      dispatch(updateToken(data.token));
      dispatch(updateUser(data.data));
      router.push(data.data?.role === userRole.USER ? "/home" : "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      toast.error("Something went wrong.");
    }
  };

  return (
    <main className="min-h-[calc(100vh_-_72px)] bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-md bg-white">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              {...register("email")}
              placeholder="Enter Email"
              // required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:outline-0 caret-primary text-sm !outline-none placeholder:text-[#808080] placeholder:font-normal [transition:all_10s_ease-in-out_9999999s] truncate"
            />
            {errors.email && (
              <p className="absolute text-red-600 text-xs top-full">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                {...register("password")}
                // required
                placeholder="Enter Password"
                className="px-4 py-2 grow focus:outline-0 !outline-none placeholder:text-[#808080] placeholder:font-normal [transition:all_10s_ease-in-out_9999999s] truncate"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pe-[18px] cursor-pointer"
              >
                {showPassword ? (
                  <FaEye className="icon-[18]" />
                ) : (
                  <FaEyeSlash className="icon-[18]" />
                )}
              </button>{" "}
            </div>
            {errors.password && (
              <p className="absolute text-red-600 text-xs top-full">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-500 transition-colors duration-200 ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href={loading ? "#" : "/auth/signup"}
            className={`text-indigo-600 font-medium hover:underline ${
              loading && "cursor-not-allowed"
            } no-underline`}
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
