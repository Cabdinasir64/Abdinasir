import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Toaster from "@/components/ui/Toaster"
import LanguageProvider from '@/components/providers/LanguageProvider'

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Abdinasir | Full Stack Developer & from Somalia",
  description:
    "Abdinasir is a passionate Full Stack Developer and Computer Science student from Somalia. Expert in modern web technologies like HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, Express.js, MongoDB, Prisma, PostgreSQL, Zustand, GSAP, and Framer Motion. Discover clean, scalable, and elegant web applications built for performance and creativity.",
  keywords: [
    "Abdinasir",
    "Portfolio",
    "Full Stack Developer",
    "Somali Developer",
    "Somalia Developer",
    "Web Developer Somalia",
    "Frontend Developer",
    "Backend Developer",
    "Next.js Developer",
    "React Developer",
    "Tailwind CSS",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
    "PostgreSQL",
    "Prisma",
    "Zustand",
    "GSAP",
    "Framer Motion",
    "Computer Science Student",
    "Software Engineer",
    "UI/UX Design",
    "Responsive Web Design",
  ],
  authors: [{ name: "Abdinasir" }],
  openGraph: {
    title: "Abdinasir | Full Stack Developer & Web Engineer from Somalia",
    description:
      "A professional portfolio of Abdinasir, showcasing advanced projects built with React, Next.js, Tailwind CSS, Node.js, and modern tools like Prisma and Framer Motion — representing Somali innovation in web technology.",
    url: "https://abdinasir.dev",
    siteName: "Abdinasir Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abdinasir Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdinasir | Full Stack Developer & Web Engineer from Somalia",
    description:
      "Explore Abdinasir’s portfolio — a blend of creativity, performance, and modern technology built with React, Next.js, TailwindCSS, Node.js, Prisma, and more.",
    images: ["/og-image.png"],
    creator: "@abdinasir",
  },
  metadataBase: new URL("https://abdinasir.dev"),
  alternates: {
    canonical: "https://abdinasir.dev",
  },
};


interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} ${playfair.variable}`}>
        <Toaster />
        <LanguageProvider />
        {children}
      </body>
    </html>
  );
}