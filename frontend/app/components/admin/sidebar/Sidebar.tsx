"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "../../../stores/uiStore";
import { LayoutDashboard, User } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, closeSidebar } = useUIStore();

    const links = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Profile", href: "/admin/profile", icon: User },
    ];

    return (
        <>
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 z-20 md:hidden"
                        onClick={closeSidebar}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>

            <div className="hidden md:flex md:flex-col md:w-64 md:h-screen md:fixed z-30 bg-white shadow-md">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {links.map(({ name, href, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={name}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${active
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        className="fixed z-30 top-0 left-0 h-full w-64 bg-white shadow-md flex flex-col md:hidden"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 240, damping: 20 }}
                    >
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
                        </div>
                        <nav className="flex-1 p-4 space-y-2">
                            {links.map(({ name, href, icon: Icon }) => {
                                const active = pathname === href;
                                return (
                                    <Link
                                        key={name}
                                        href={href}
                                        onClick={closeSidebar}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${active
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
