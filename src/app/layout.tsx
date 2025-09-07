import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/auth/stack-auth";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import "@/polyfills";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Additional PKCE fix for Stack Auth
if (typeof window !== 'undefined') {
  // Ensure crypto.digest is available
  if (window.crypto && !window.crypto.digest) {
    // @ts-ignore
    window.crypto.digest = async function(algorithm, data) {
      const crypto = require('crypto');
      if (algorithm === 'SHA-256' || algorithm === 'sha-256') {
        return crypto.createHash('sha256').update(Buffer.from(data)).digest().buffer;
      }
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    };
  }
}

export const metadata: Metadata = {
  title: "aun.ai",
  description: "Open Source AI App Builder",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased`
        )}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
              forcedTheme="light"
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}