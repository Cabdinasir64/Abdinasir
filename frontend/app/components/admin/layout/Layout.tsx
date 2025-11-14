"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserStore } from "../../../stores/userStore";

import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { fetchUser, loading } = useUserStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const verify = async () => {
            try {
                await fetchUser();

                const stateUser = useUserStore.getState().user;
                const stateError = useUserStore.getState().error;

                if (!stateUser) {
                    toast.error("Please log in to access the admin panel");
                    router.push("/login");
                    return;
                }

                if (stateUser) {
                    setIsChecking(false);
                    return;
                }

                if (stateError) {
                    toast.error(stateError);
                    setIsChecking(false);
                    return;
                }
                router.push("/login");

            } catch (err) {
                toast.error("Something went wrong");
                router.push("/login");
            }
        };

        verify();
    }, [router, fetchUser]);

    if (loading || isChecking) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>

                <p className="text-gray-700 text-lg font-medium mb-2">Loading dashboard...</p>

                <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-32 h-2 bg-blue-400 animate-pulse"></div>
                </div>
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
