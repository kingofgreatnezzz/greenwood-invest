"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Pages where we don't want to show the full navigation
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboardPage = pathname?.startsWith("/dashboard");
  const isAdminPage = pathname === "/admin";
  
  // Don't render navigation on auth pages
  if (isAuthPage) {
    return (
      <header className="w-full h-20 z-20 fixed top-0 left-0 bg-[var(--background)] px-4 lg:px-20 flex justify-between items-center shadow-sm">
        {/* Logo/Brand - Always show */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[var(--brand)]">
          <span className="text-3xl">&#9650;</span>
          <span className="font-extrabold tracking-tight">investlp</span>
        </Link>
        
        {/* Back to Home button */}
        <Link 
          href="/" 
          className="px-5 py-2 rounded border border-[var(--brand)] text-[var(--brand)] font-semibold hover:bg-[var(--brand)]/10 transition"
        >
          Back to Home
        </Link>
      </header>
    );
  }

  // Dashboard navigation - simplified header
  if (isDashboardPage || isAdminPage) {
    return (
      <header className="w-full h-20 z-20 fixed top-0 left-0 bg-[var(--background)] px-4 lg:px-20 flex justify-between items-center shadow-sm">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[var(--brand)]">
          <span className="text-3xl">&#9650;</span>
          <span className="font-extrabold tracking-tight">investlp</span>
        </Link>
        
        {/* User menu */}
        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="flex items-center gap-3">
              <span className="text-[var(--foreground)] font-medium">
                Welcome, {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>
    );
  }

  // Main navigation for public pages
  return (
    <header className="w-full h-20 z-20 fixed top-0 left-0 bg-[var(--background)] px-4 lg:px-20 flex justify-between items-center shadow-sm">
      {/* Logo/Brand */}
      <div className="flex items-center gap-2 text-2xl font-bold text-[var(--brand)]">
        <span className="text-3xl">&#9650;</span>
        <span className="font-extrabold tracking-tight">investlp</span>
      </div>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/trading" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium">Trading</Link>
        <Link href="/platforms" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium">Platforms</Link>
        <Link href="/promotions" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium">Promotions</Link>
        <Link href="/education" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium">Education</Link>
        <Link href="/about" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium">About Us</Link>
        
        {/* Show different buttons based on auth status */}
        {status === "loading" ? (
          <div className="ml-4 px-5 py-2 rounded bg-gray-400 text-white font-semibold">Loading...</div>
        ) : session ? (
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="ml-4 px-5 py-2 rounded bg-[var(--brand)] text-[var(--foreground)] font-semibold hover:opacity-90 transition">
              Dashboard
            </Link>
            {session.user?.role === 'admin' && (
              <Link href="/admin" className="ml-2 px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition">
                Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="ml-2 px-5 py-2 rounded border border-[var(--brand)] text-[var(--brand)] font-semibold hover:bg-[var(--brand)]/10 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" className="ml-4 px-5 py-2 rounded bg-[var(--brand)] text-[var(--foreground)] font-semibold hover:opacity-90 transition">Sign in</Link>
            <Link href="/register" className="ml-2 px-5 py-2 rounded border border-[var(--brand)] text-[var(--brand)] font-semibold hover:bg-[var(--brand)]/10 transition">Register</Link>
          </>
        )}
      </nav>
      
      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-[var(--brand)] text-2xl" onClick={() => setIsOpen(!isOpen)}>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      
      {/* Mobile Side Menu */}
      <div className={`${isOpen ? "fixed" : "hidden"} top-0 right-0 h-full w-2/3 bg-[var(--background)] z-30 shadow-lg flex flex-col p-6 gap-6 md:hidden transition-all duration-300`}> 
        <button className="self-end text-2xl text-[var(--foreground)]" onClick={() => setIsOpen(false)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <Link href="/trading" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium" onClick={() => setIsOpen(false)}>Trading</Link>
        <Link href="/platforms" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium" onClick={() => setIsOpen(false)}>Platforms</Link>
        <Link href="/promotions" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium" onClick={() => setIsOpen(false)}>Promotions</Link>
        <Link href="/education" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium" onClick={() => setIsOpen(false)}>Education</Link>
        <Link href="/about" className="text-[var(--foreground)] hover:text-[var(--brand)] font-medium" onClick={() => setIsOpen(false)}>About Us</Link>
        
        {/* Mobile auth buttons */}
        {status === "loading" ? (
          <div className="mt-4 px-5 py-2 rounded bg-gray-400 text-white font-semibold">Loading...</div>
        ) : session ? (
          <div className="flex flex-col gap-2">
            <Link href="/dashboard" className="mt-4 px-5 py-2 rounded bg-[var(--brand)] text-[var(--foreground)] font-semibold hover:opacity-90 transition" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            {session.user?.role === 'admin' && (
              <Link href="/admin" className="mt-2 px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition" onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="mt-2 px-5 py-2 rounded border border-[var(--brand)] text-[var(--brand)] font-semibold hover:bg-[var(--brand)]/10 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" className="mt-4 px-5 py-2 rounded bg-[var(--brand)] text-[var(--foreground)] font-semibold hover:opacity-90 transition" onClick={() => setIsOpen(false)}>Sign in</Link>
            <Link href="/register" className="mt-2 px-5 py-2 rounded border border-[var(--brand)] text-[var(--brand)] font-semibold hover:bg-[var(--brand)]/10 transition" onClick={() => setIsOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </header>
  );
} 