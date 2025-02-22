import type { Metadata } from "next";
import "./globals.css";
import Appbar from "@/components/Appbar";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/app/_providers/provider";
import { PostHogProvider } from "./_providers/posthog-provider";
import { QueryProvider } from "./_providers/query-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "400", "500", "600", "700"],
  variable: "--font-poppins",
});


export const metadata: Metadata = {
  title: "holo.ai | Personalized AI for your every need",
  description: "holo.ai is a platform for personalized AI for your every need",
  openGraph: {
    title: "holo.ai | Personalized AI for your every need",
    description: "holo.ai is a platform for personalized AI for your every need",
    url: "https://holo.deepanshumishra.me",
    siteName: "holo.ai",
    images: [
      { url: "/og.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Appbar />
            <PostHogProvider>
              {children}
            </PostHogProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
