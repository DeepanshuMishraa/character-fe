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
  display: "swap", 
});

export const metadata: Metadata = {
  title: "holo.ai | Personalized AI Chat & Solutions for Every Need",
  description:
    "Discover holo.ai, the ultimate platform for personalized AI chat and solutions tailored to your needs. Experience cutting-edge AI technology today!",
  keywords: [
    "personalized AI",
    "AI chat platform",
    "holo.ai",
    "AI solutions",
    "artificial intelligence",
    "custom AI",
    "AI for everyone",
  ], 
  authors: [{ name: "Deepanshu Mishra", url: "https://deepanshumishra.me" }], 
  viewport: "width=device-width, initial-scale=1", 
  robots: "index, follow", 
  alternates: {
    canonical: "https://holo.deepanshumishra.me", 
  },
  openGraph: {
    title: "holo.ai | Personalized AI Chat & Solutions for Every Need",
    description:
      "holo.ai offers personalized AI chat and solutions designed for your unique needs. Explore the future of AI technology now!",
    url: "https://holo.deepanshumishra.me",
    siteName: "holo.ai",
    images: [
      {
        url: "https://holo.deepanshumishra.me/og.png",
        width: 1200,
        height: 630,
        alt: "holo.ai - Personalized AI Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "holo.ai | Personalized AI Chat & Solutions",
    description:
      "Join holo.ai for personalized AI chat and innovative solutions tailored just for you!",
    images: ["https://holo.deepanshumishra.me/og.png"],
    creator: "@DeepanshuDipxsy", 
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "holo.ai",
  url: "https://holo.deepanshumishra.me",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://holo.deepanshumishra.me/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  description: "A platform offering personalized AI chat and solutions for every need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <link
          rel="preload"
          href="/og.png"
          as="image"
          type="image/png"
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
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
