import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CreatorX",
  description: "Product Creator module for Growth OS"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}
