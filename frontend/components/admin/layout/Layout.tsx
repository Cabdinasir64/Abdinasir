"use client";
import { useAuthInit } from "../../../app/hooks/useAuthInit";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isInitialized, user, loading } = useAuthInit();

    if (!isInitialized || loading) {
        return (
            <>
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
            </>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64">
                <Header />
                <main className="flex-1 p-1 md:p-6">{children}</main>
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