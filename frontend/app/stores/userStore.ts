import { create } from 'zustand';

interface User {
    id: string;
    username: string;
    email: string;
    profileImage?: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: false,
    error: null,

    fetchUser: async () => {
        set({ loading: true, error: null });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to fetch user');

            const data: User = await res.json();

            set({ user: data, loading: false });

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            set({ error: message, loading: false });
        }
    },

    logout: async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to logout');

            set({ user: null });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            set({ error: message });
        }
    },
}));
