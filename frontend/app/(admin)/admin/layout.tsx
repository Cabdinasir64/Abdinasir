import ClientLayout from "../../components/admin/layout/Layout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | My Portfolio",
    description: "Manage your portfolio content, view analytics, and update projects securely.",
    keywords: ["admin", "dashboard", "portfolio", "projects", "analytics"],
    authors: [{ name: "Abdinasir", url: "https://abdinasir.dev" }],
    viewport: "width=device-width, initial-scale=1.0",
    robots: "index, follow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <ClientLayout>{children}</ClientLayout>;
}
