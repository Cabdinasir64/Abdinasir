import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  role?: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isRehydrated: boolean;
  setRehydrated: (value: boolean) => void; 
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      isRehydrated: false,

      setRehydrated: (value: boolean) => set({ isRehydrated: value }),

      checkAuth: async (): Promise<boolean> => {
        const { user } = get();
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (res.status === 401) {
            set({ user: null, loading: false });
            localStorage.removeItem('user-storage');
            return false;
          }
          if (!res.ok) throw new Error(`Auth check failed: ${res.status}`);
          const data: { user: User } = await res.json();
          if (!user || user.id !== data.user.id) set({ user: data.user, loading: false });
          return true;
        } catch (err) {
          console.error('Auth check error:', err);
          set({ user: null, loading: false });
          localStorage.removeItem('user-storage');
          return false;
        }
      },

      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (res.status === 401) {
            set({ user: null, loading: false });
            localStorage.removeItem('user-storage');
            return;
          }
          if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
          const data: { user: User } = await res.json();
          set({ user: data.user, loading: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('Fetch user error:', message);
          set({ user: null, loading: false, error: message });
          localStorage.removeItem('user-storage');
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (err) {
          console.error('Logout API error:', err);
        } finally {
          set({ user: null, loading: false, error: null });
          localStorage.removeItem('user-storage');
          sessionStorage.clear();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      onRehydrateStorage: () => (state) => {
        state?.setRehydrated?.(true);
      },
    }
  )
);
