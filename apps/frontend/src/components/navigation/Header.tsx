"use client";
import { logoutUser } from "@/lib/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = () => {
    if (confirm("Are you sure you want to logout?")) {
      dispatch(logoutUser());
      router.push("/");
    }
  };

  return (
    <>
      <header>
        <nav className="bg-gray border-gray-200 px-4 lg:px-6 py-3.5 dark:bg-gray-800 ">
          <div className="flex flex-wrap justify-between items-center mx-auto container">
            <a href="/" className="flex items-center">
              {/* <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              /> */}
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Full Stack App
              </span>
            </a>

            {isAuthenticated ? (
              <div
                className="hidden justify-between items-center w-full lg:flex lg:w-auto"
                id="mobile-menu-2"
              >
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                  <li>
                    <Link
                      href="/home"
                      className={`rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700dark:text-white ${
                        pathname === "/home" && "!text-white"
                      }`}
                      aria-current="page"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className={`rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700dark:text-white ${
                        pathname === "/contact" && "!text-white"
                      }`}
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className={`block py-2 pl-3 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700dark:text-white ${
                        pathname === "/about" && "!text-white"
                      }`}
                      aria-current="page"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              ""
            )}
            {isAuthenticated ? (
              <button
                className="text-white font-bold cursor-pointer text-md"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center">
                <Link
                  href="/auth/login"
                  className={`text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 rounded-lg text-md font-semibold px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 ${
                    pathname === "/auth/login" && "bg-gray-50 bg-gray-700"
                  }`}
                >
                  Log in
                </Link> <span className="font-bold text-2xl text-white"> / </span> &nbsp;&nbsp;&nbsp;
                <Link
                  href="/auth/signup"
                  className={`text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 rounded-lg text-md font-semibold px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 ${
                    pathname === "/auth/signup" && "bg-gray-50 bg-gray-700"
                  }`}
                >
                  Sign Up
                </Link>
                <button
                  data-collapse-toggle="mobile-menu-2"
                  type="button"
                  className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="mobile-menu-2"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      {/* <header className="bg-[#7179cf] w-[100vw] p-1">
        <nav className="container mx-auto flex flex-wrap items-center justify-between">
          <h1 className="self-center text-xl font-semibold text-amber-50">
            First App
          </h1>
          <ul className="flex font-medium gap-5 items-center justify-center">
            <li>
              <Link
                href="/home"
                className={`block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700dark:text-white ${
                  pathname === "/home" && "bg-white"
                }`}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:text-primary-700 lg:p-0 block py-2 pr-4 pl-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700dark:text-white ${
                  pathname === "/contact" && "bg-white"
                }`}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700dark:text-white ${
                  pathname === "/about" && "bg-white"
                }`}
                aria-current="page"
              >
                About
              </Link>
            </li>
          </ul>
          <div className="flex items-center lg:order-2">
            <Link
              href="/auth/login"
              className={`text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 ${
                pathname === "/auth/login" && "bg-gray-50 bg-gray-700"
              }`}
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className={`text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 ${
                pathname === "/auth/signup" && "bg-gray-50 bg-gray-700"
              }`}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header> */}
    </>
  );
};

export default Header;
