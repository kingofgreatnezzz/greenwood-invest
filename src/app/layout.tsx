import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./Navigation";
import Footer from "../components/Footer";
import AuthProvider from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "investlp - Investment Platform",
  description: "Empower your investments with smart tools, expert insights, and a secure platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <div className="bg-spotlight" />
        <AuthProvider>
          <Navigation />
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  )
}
