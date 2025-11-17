import { useEffect } from 'react';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'next/navigation';

export const useAutoLogout = () => {
    const { user, logout } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (!user) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
                    credentials: 'include',
                });

                if (res.status === 401) {
                    await logout();
                    router.push('/login');
                }
            } catch (err) {
            }
        };

        const interval = setInterval(checkAuthStatus, 30000);

        const handleFocus = () => checkAuthStatus();
        window.addEventListener('focus', handleFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
        };
    }, [user, logout, router]);
};