"use client";

import { updateToken, updateUser, userRole } from "@/lib/features/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const LoginPage = () => {
  const [model, setModel] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onInputValueChange = (value: string, field: string) => {
    setModel((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    if (!model.email || !model.password) {
      alert("Email and Password are required.");
      return;
    }

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
        alert(errorData.message || "Login failed");
        setLoading(false);
        return;
      }

      const data = await response.json();
      dispatch(updateToken(data.token));
      dispatch(updateUser(data.user));

      router.push(data.user?.role === userRole.USER ? "/home" : "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh_-_72px)] bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-md bg-white">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Login
          </h1>
        </div>

        <form onSubmit={onSubmitForm} className="mt-8 space-y-6">
          <div>
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
              onChange={(e) => onInputValueChange(e.target.value, "email")}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => onInputValueChange(e.target.value, "password")}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-500 transition-colors duration-200"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
