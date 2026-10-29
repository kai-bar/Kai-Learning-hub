import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kai Learning Hub",
  description: "School learning platform for students, teachers, and admins"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
