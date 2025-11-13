"use client";
import { Menu, } from "lucide-react";
import { useUIStore } from "../../../stores/uiStore";
import { motion } from "framer-motion";

export default function Header() {
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);

    return (
        <motion.header
            className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-40 border-b border-slate-200"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-4">
                <motion.button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Menu className="w-5 h-5 text-slate-700" />
                </motion.button>

                <div className="hidden md:block">
                    <h1 className="text-lg font-semibold text-slate-800">Welcome Back, Admin!</h1>
                    <p className="text-sm text-slate-600">Here's what's happening today</p>
                </div>
            </div>

            <h1 className="text-lg md:text-xl font-semibold text-slate-800 md:hidden">
                Admin Panel
            </h1>

            <div className="flex items-center gap-4">
                <motion.div
                    className="hidden md:flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                        A
                    </div>
                    <span className="text-sm font-medium text-slate-700">Admin</span>
                </motion.div>

                <motion.div
                    className="md:hidden flex items-center cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                        A
                    </div>
                </motion.div>
            </div>
        </motion.header>
    );
}