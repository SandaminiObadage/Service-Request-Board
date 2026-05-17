import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Mini Service Request Board",
  description: "GlobalTNA assessment project for managing homeowner service requests."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
