"use client";
import { useAuthInit } from "../../../hooks/useAuthInit";
import { useAutoLogout } from "../../../hooks/useAutoLogout";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "../../ui/LoadingSpinner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isInitialized, user, loading } = useAuthInit();
    useAutoLogout();

    if (!isInitialized || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <Toaster position="top-right" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <Toaster position="top-right" />
            </div>
        );
    }

    if (user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access the admin panel.</p>
                </div>
                <Toaster position="top-right" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64">
                <Header />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#1f2937',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        maxWidth: '400px',
                    },
                    success: {
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                        },
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                        },
                    },
                    loading: {
                        style: {
                            background: '#fffbeb',
                            color: '#92400e',
                            border: '1px solid #fed7aa',
                        },
                    },
                }}
            />
        </div>
    );
}