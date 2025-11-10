import Login from "../components/login/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | My Portfolio",
  description: "Sign in to access your portfolio dashboard and explore projects.",
  openGraph: {
    title: "Login | My Portfolio",
    description: "Sign in to access your portfolio dashboard and explore projects.",
    url: "https://abdinasir.dev/login",
    siteName: "My Portfolio",
    images: [
      {
        url: "https://abdinasir.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Portfolio Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | My Portfolio",
    description: "Sign in to access your portfolio dashboard and explore projects.",
    images: ["/og-image.png"],
  },
};

export default function LoginPage() {
  return (
    <div>
      <Login />
    </div>
  );
}
