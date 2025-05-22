"use client";

import { updateToken, updateUser } from "@/lib/features/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { z } from "zod";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const formSchema = z
    .object({
      name: z
        .string()
        .min(1, "Full Name is required.")
        .min(2, "Full Name must be at least 2 characters."),
      email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),
      password: z
        .string()
        .trim()
        .min(1, "Password is required.")
        .min(6, "Password must be at least 6 characters."),
      confirmPassword: z
        .string()
        .trim()
        .min(1, "Confirm password is required.")
        .min(6, "Confirm password must be at least 6 characters."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "The passwords must match.",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitForm: SubmitHandler<z.infer<typeof formSchema>> = async (
    model
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(model),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Signup failed");
        setLoading(false);
        return;
      }

      const data = await response.json();
      dispatch(updateToken(data.token));
      dispatch(updateUser(data.data));
      router.push("/home");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh_-_72px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Create your account
        </h2>

        <form onSubmit={handleSubmit(onSubmitForm)} className="mt-8 space-y-6">
          <div className="relative">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              autoComplete="fullName"
              {...register("name")}
              placeholder="Enter Full Name"
              // required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:outline-0 caret-primary text-sm !outline-none placeholder:text-[#808080] placeholder:font-normal [transition:all_10s_ease-in-out_9999999s] truncate"
            />
            {errors.name && (
              <p className="absolute text-red-600 text-xs top-full">
                {errors.name.message}
              </p>
            )}
          </div>

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

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="confirm-password"
                {...register("confirmPassword")}
                // required
                placeholder="Enter Password"
                className="px-4 py-2 grow focus:outline-0 !outline-none placeholder:text-[#808080] placeholder:font-normal [transition:all_10s_ease-in-out_9999999s] truncate"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="pe-[18px] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FaEye className="icon-[18]" />
                ) : (
                  <FaEyeSlash className="icon-[18]" />
                )}
              </button>{" "}
            </div>
            {errors.confirmPassword && (
              <p className="absolute text-red-600 text-xs top-full">
                {errors.confirmPassword.message}
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
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={loading? "#" : "/auth/login"}
            className={`text-indigo-600 font-medium hover:underline ${loading && 'cursor-not-allowed'} no-underline`}
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
