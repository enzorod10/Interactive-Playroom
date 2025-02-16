import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ModeToggle } from '@/components/ui/mode-toggle'

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
  title: "Interactive Playroom",
  description: "Explore. Interact. Play.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary/30 dark:bg-secondary/80`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="w-full justify-between h-16 flex items-center px-4 ">
              <Link href='/'>
                <Avatar className="w-14 h-14">
                  <AvatarImage src="website_icon.png" />
                </Avatar>
              </Link>
              <ModeToggle />
            </div>
            <div className="h-[calc(100dvh-64px)] overflow-hidden">
              {children}
            </div>
        </ThemeProvider>
        </body>
    </html>
  );
}
