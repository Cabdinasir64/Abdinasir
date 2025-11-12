"use client";

import { Menu } from "lucide-react";
import { useUIStore } from "../../../stores/uiStore";

export default function Header() {
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);

    return (
        <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-40">
            <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            >
                <Menu className="w-6 h-6 text-slate-700" />
            </button>

            <h1 className="text-lg md:text-xl font-semibold text-slate-800">
                Admin Panel
            </h1>

            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                    A
                </div>
            </div>
        </header>
    );
}
