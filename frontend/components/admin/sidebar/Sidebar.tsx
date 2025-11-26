"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "../../../stores/uiStore";
import {
    LayoutDashboard,
    FileText,
    ChevronDown,
    ChevronRight,
    User,
    Image,
    MessageCircle,
    Zap,
    MessageSquare
} from "lucide-react";
import { useState } from "react";


export default function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, closeSidebar } = useUIStore();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);


    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const mainLinks = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ];

    const dropdownLinks = [
        {
            name: "Projects",
            icon: FileText,
            items: [
                { name: "All Projects", href: "/admin/projects" },
                { name: "Add Project", href: "/admin/projects/add" },
            ]
        },
        {
            name: "Testimonials",
            icon: MessageCircle,
            items: [
                { name: "All testimonials", href: "/admin/testimonials" },
                { name: "Add testimonial", href: "/admin/testimonials/add" },
            ]
        },
        {
            name: "skills",
            icon: Zap,
            items: [
                { name: "All skills", href: "/admin/skills" },
                { name: "Add skill", href: "/admin/skills/add" },
            ]
        }
    ];

    const bottomLinks = [
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        { name: "Profile", href: "/admin/profile", icon: User },
    ];

    const renderLink = ({ name, href, icon: Icon }: any, active: boolean, onClick?: () => void) => (
        <motion.div whileHover={{ x: 4 }} key={name}>
            <Link
                href={href}
                onClick={onClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${active
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
            >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{name}</span>
            </Link>
        </motion.div>
    );

    const renderDropdown = (section: any) => {
        const isOpen = openDropdown === section.name;
        const hasActiveChild = section.items.some((item: any) => pathname === item.href);

        return (
            <div key={section.name} className="space-y-1">
                <motion.button
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all ${hasActiveChild
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    onClick={() => toggleDropdown(section.name)}
                    whileHover={{ x: 4 }}
                >
                    <div className="flex items-center gap-3">
                        <section.icon className="w-5 h-5" />
                        <span className="font-medium">{section.name}</span>
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="ml-6 space-y-1 border-l-2 border-slate-200 pl-3 py-1">
                                {section.items.map((item: any) => {
                                    const active = pathname === item.href;
                                    return (
                                        <motion.div
                                            key={item.name}
                                            whileHover={{ x: 4 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={closeSidebar}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${active
                                                    ? "bg-blue-100 text-blue-600 font-medium"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`}
                                            >
                                                <ChevronRight className="w-3 h-3" />
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200">
                <motion.h2
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                    Admin Panel
                </motion.h2>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="space-y-2">
                    {mainLinks.map((link) =>
                        renderLink(link, pathname === link.href, closeSidebar)
                    )}
                </div>
                <div className="space-y-2">
                    {dropdownLinks.map(renderDropdown)}
                </div>

                <div className="space-y-2 border-slate-200">
                    {bottomLinks.map((link) =>
                        renderLink(link, pathname === link.href, closeSidebar)
                    )}
                </div>
            </nav>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 z-40 md:hidden"
                        onClick={closeSidebar}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>
            <motion.div
                className="hidden md:flex md:flex-col md:w-64 md:h-screen md:fixed z-50 bg-white shadow-lg border-r border-slate-200"
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0 }}
            >
                {sidebarContent}
            </motion.div>
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        className="fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col md:hidden"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {sidebarContent}
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}