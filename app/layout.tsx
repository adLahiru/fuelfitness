import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/contexts/Providers";

export const metadata: Metadata = {
  title: "FuelFitness | Premium Supplements for Athletes",
  description:
    "Premium, science-backed supplements engineered for athletes who demand the absolute best from their bodies. Shop protein, pre-workout, creatine, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-text-primary font-body selection:bg-neon selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
