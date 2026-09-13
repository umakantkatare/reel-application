"use client";
import React, { SyntheticEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (
    e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        throw new Error(res.error);
      }
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Login failed: ${err.message}`);
        setError(err.message);
      } else {
        console.error("Login failed");
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Login to your account to continue.
            </p>
          </div>
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="mt-7 border-t border-slate-800 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?
              <Link
                href="/register"
                className="font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
};

export default Login;
