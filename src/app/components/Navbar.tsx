"use client";

import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { useTransition } from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();

  const user = session?.user as User;

  const handleLogout = () => {
    startTransition(async () => {
      await signOut({
        callbackUrl: "/login",
      });
    });
  };

  const username = user?.email?.split("@")[0] || "User";

  const avatar = username.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-white sm:text-2xl">
          Reel
          <span className="text-purple-500">App</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-white/10" />
          ) : session ? (
            <>
              <Link href="/upload">
                <button className="border-white/10 bg-transparent text-white hover:bg-white/10">
                  Upload Reel
                </button>
              </Link>

              <Link href="/profile" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-sm font-semibold text-purple-400">
                  {avatar}
                </div>

                <span className="hidden max-w-32 truncate text-sm font-medium text-white sm:block">
                  {username}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isPending}
                className="h-9"
              >
                {isPending ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-white hover:bg-white/10">
                  Sign In
                </button>
              </Link>

              <Link href="/signup">
                <button className="bg-white text-black hover:bg-neutral-200">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
