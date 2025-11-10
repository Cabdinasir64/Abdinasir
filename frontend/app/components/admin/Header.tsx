"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import UserDropdown from './UserDropdown';

interface User {
    id: string;
    username: string;
    email: string;
    profileImage?: string;
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) throw new Error('Failed to fetch user data');

            const userData = await res.json();
            console.log('Fetched user data:', userData.user);
            setUser(userData.user);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (res.ok) {
                toast.success('Logged out successfully');
                router.push('/login');
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const getInitial = () => {
        if (!user?.username) return 'U';
        return user.username.charAt(0).toUpperCase();
    };

    return (
        <header className="bg-white border-b border-secondary-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left Side - Menu Button for Mobile */}
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Welcome Message */}
                    <div className="ml-4 lg:ml-0">
                        <h1 className="text-xl font-semibold text-secondary-800">
                            Welcome back{user ? `, ${user.username}` : ''}!
                        </h1>
                        <p className="text-secondary-600 text-sm">Admin Dashboard</p>
                    </div>
                </div>

                {/* Right Side - User Info & Dropdown */}
                <div className="flex items-center space-x-4">
                    {loading ? (
                        <div className="animate-pulse flex items-center space-x-3">
                            <div className="w-10 h-10 bg-secondary-200 rounded-full"></div>
                            <div className="hidden md:block">
                                <div className="h-4 bg-secondary-200 rounded w-20"></div>
                                <div className="h-3 bg-secondary-200 rounded w-16 mt-1"></div>
                            </div>
                        </div>
                    ) : user ? (
                        <UserDropdown
                            user={user}
                            onLogout={handleLogout}
                            getInitial={getInitial}
                        />
                    ) : (
                        <div className="text-secondary-500">Not logged in</div>
                    )}
                </div>
            </div>
        </header>
    );
}