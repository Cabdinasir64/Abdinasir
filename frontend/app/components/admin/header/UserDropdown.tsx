"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../../../stores/userStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UserDropdown() {
    const { user, logout, loading } = useUserStore();
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (err) {
            toast.error("Logout failed");
        }
    };
    useEffect(() => {
        console.log("User data in UserDropdown:", user?.username);
    }, [user]);

    const avatarContent = user
        ? user.profileImage
            ? <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            : <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : "?"}
            </span>
        : <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />; 


    return (
        <div className="relative">
            <motion.div
                className="flex items-center cursor-pointer"
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.05 }}
            >
                {avatarContent}
            </motion.div>

            <AnimatePresence>
                {open && user && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-50"
                    >
                        <div className="p-4 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-800">{user.username}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <div className="flex flex-col py-1">
                            <button
                                className="text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-700"
                                onClick={() => router.push("/profile")}
                            >
                                Profile
                            </button>
                            <button
                                className="text-left px-4 py-2 hover:bg-slate-100 text-sm text-red-600"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
