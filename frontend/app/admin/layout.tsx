import AdminLayout from '../components/admin/AdminLayout';

export const metadata = {
  title: 'Admin Dashboard - My Portfolio',
  description: 'Admin dashboard for portfolio management',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}