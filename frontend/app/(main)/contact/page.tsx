import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact – Full Stack Developer & Web Engineer from Somalia",
  description:
    "Get in touch with Abdinasir, a web and software developer, to discuss collaborations, freelance projects, or opportunities. Reach out via email or contact form.",
  keywords: [
    "Abdinasir",
    "Contact",
    "Portfolio Contact",
    "Web Developer Contact",
    "Freelance Developer",
    "Hire Abdinasir",
    "Email Abdinasir",
  ],
  alternates: {
    canonical: "https://abdinasir.dev/contact",
  },
  openGraph: {
    title: "Contact – Abdinasir | Portfolio",
    description:
      "Connect with Abdinasir for projects, collaborations, and freelance work. Use the contact form or email to get in touch.",
    url: "https://abdinasir.dev/contact",
    siteName: "Abdinasir Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Abdinasir – Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact – Abdinasir | Portfolio",
    description:
      "Reach out to Abdinasir for collaborations, freelance projects, or inquiries.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Contact = dynamic(() => import("@/components/contact/Contact"));

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <Contact />
    </Suspense>
  );
}
