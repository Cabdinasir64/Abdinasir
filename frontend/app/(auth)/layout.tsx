import { ReactNode } from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | My Portfolio",
    description: "Sign in to access your portfolio dashboard.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Link
                href="/"
                className="text-white hover:underline font-medium absolute top-4 left-4"
            >
                &larr; Back to Home
            </Link>

            {children}
        </>
    );
}
