import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koda — Time Tracking",
  description: "Secure, modern time tracking for professionals",
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
    <html lang="en" className="dark">
      <body className="noise antialiased min-h-screen bg-koda-bg">
        {children}
      </body>
    </html>
  );
}
