import "./globals.css";
import type { Metadata } from "next";
import NavLinks from "./NavLinks";

export const metadata: Metadata = {
  title: "RoleJump",
  description: "Discover career paths from your existing skills",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Top Navigation */}
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-semibold tracking-tight">
              RoleJump
            </a>
            <NavLinks />
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>

        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-gray-500">
            © {new Date().getFullYear()} RoleJump. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
