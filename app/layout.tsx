import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/components/SessionProvider";
import ReactQueryProvider from "./providers/react-query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ACDA",
  description:
    "Together, we envision a healthier tomorrow — where awareness, prevention, and early intervention shape the future of diabetes care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            <AnnouncementBar
              message="Annual ACDA conference on 25th and 26th October 2025."
              priority="info"
            />
            <Header />
            <link rel="icon" href="/logos/logo.jpg" />
            <ReactQueryProvider>
              {" "}
              <main className="flex-1">{children}</main>
            </ReactQueryProvider>
            <Footer />
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
