import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-[calc(100vh_-_72px)] flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Welcome to my first full stack app
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-xl mb-8">
        This is a modern full-stack application using Next.js, Express,
        TypeScript, and PostgreSQL.
      </p>
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
