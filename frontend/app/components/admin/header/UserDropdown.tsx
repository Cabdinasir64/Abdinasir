"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../../../stores/userStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function UserDropdown() {
    const { user, logout, loading } = useUserStore();
    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const handleLogout = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            toast.success("Logged out successfully");
            setOpen(false);
            router.push("/login");
        } catch (err) {
            toast.error("Logout failed");
        } finally {
            setIsLoggingOut(false);
        }
    }, [logout, router]);

    const toggleDropdown = useCallback(() => {
        if (!loading && !isLoggingOut) {
            setOpen(prev => !prev);
        }
    }, [loading, isLoggingOut]);

    const closeDropdown = useCallback(() => {
        setOpen(false);
    }, []);

    const avatarContent = user
        ? user.profileImage
            ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                        src={user.profileImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="40px"
                        priority
                    />
                </div>
            )
            : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                </div>
            )
        : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse shadow-md" />
        );

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                className={`
                    flex items-center gap-2
                    rounded-full p-1 transition-all duration-200
                    ${open
                        ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50"
                        : "hover:ring-2 hover:ring-gray-200"
                    }
                    ${(loading || isLoggingOut) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                onClick={toggleDropdown}
                whileHover={!loading && !isLoggingOut ? { scale: 1.05 } : {}}
                whileTap={!loading && !isLoggingOut ? { scale: 0.95 } : {}}
                disabled={loading || isLoggingOut}
            >
                {avatarContent}
            </motion.button>

            <AnimatePresence>
                {open && user && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                    >
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                {avatarContent}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.username}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <Link href="/admin/profile" passHref>
                                <motion.div
                                    whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-3 rounded-lg text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center cursor-pointer"
                                    onClick={closeDropdown}
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </motion.div>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#fef2f2" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-10 z-40 md:hidden"
                        onClick={closeDropdown}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}