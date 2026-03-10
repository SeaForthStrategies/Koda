import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koda — B2B Time Tracking",
  description: "Time tracking for teams and employers. Accurate timesheets, approvals, and compliance.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⏱</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased min-h-screen bg-slate-50 bg-koda-bg text-slate-900 text-koda-text">
        {children}
      </body>
    </html>
  );
}
