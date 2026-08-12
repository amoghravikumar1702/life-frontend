import Link from "next/link";
import { signIn } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-6">
      <form
        action={signIn}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <h1 className="mb-2 text-3xl font-semibold text-white">
          Welcome back
        </h1>

        <p className="mb-8 text-sm text-gray-400">
          Sign in to continue to ArkenOne.
        </p>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          Sign In
        </button>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-cyan-400 hover:underline"
          >
            Create one
          </Link>
        </div>
      </form>
    </main>
  );
}