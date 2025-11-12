import ClientLayout from "../components/admin/layout/Layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <ClientLayout>{children}</ClientLayout>;
}
