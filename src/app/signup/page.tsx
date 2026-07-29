import { signUp } from "./actions";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-6">
      <form action={signUp} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="mb-8 text-3xl font-semibold text-white">
          Create your FINZURA account
        </h1>

        <div className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          Create Account
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </main>
  );
}