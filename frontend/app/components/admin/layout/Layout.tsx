"use client";

import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64">
                <Header />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
