"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const LoginPage = () => {
  const [model, setModel] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onInputValueChange = (value: string, type: string) => {
    setModel((prevModel) => ({ ...prevModel, [type]: value }));
  };

const onSubmitForm = async (e: FormEvent) => {
  e.preventDefault();

  if (!model.email) {
    alert("Email is required.");
    return;
  }

  if (!model.password) {
    alert("Password is required.");
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      }
    );

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      console.error("Login failed:", errorData);
      alert(errorData.message || "Login failed");
      setLoading(false);
      return;
    }

    const data = await response.json();
    console.log("Login successful", data);
    if(data?.user?.role === 'USER'){
      router.push('/home');
    } else {
      router.push('/dashboard')
    }
    // Proceed with storing token, navigating, etc.
  } catch (error) {
    setLoading(false);
    console.error("Error in login", error);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Login to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={onSubmitForm}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                onChange={(e) => onInputValueChange(e.target.value, "email")}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                onChange={(e) => onInputValueChange(e.target.value, "password")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have a account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
