import { create } from 'zustand';
import { persist, PersistStorage, StorageValue } from 'zustand/middleware';
import toast from 'react-hot-toast'
import { encrypt, decrypt } from '../utils/encryption';

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
  sessionExpired: boolean;
  manualLogout: boolean;
  setRehydrated: (value: boolean) => void;
  setSessionExpired: (value: boolean) => void;
  setManualLogout: (value: boolean) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

const encryptedStorage: PersistStorage<UserState> = {
  getItem: (name: string): StorageValue<UserState> | null => {
    const cipher = localStorage.getItem(name);
    if (!cipher) return null;
    try {
      const decryptedString = decrypt(cipher);
      return JSON.parse(decryptedString) as StorageValue<UserState>;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<UserState>) => {
    localStorage.setItem(name, encrypt(JSON.stringify(value)));
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      isRehydrated: false,
      sessionExpired: false,
      manualLogout: false,


      setRehydrated: (value: boolean) => set({ isRehydrated: value }),
      setSessionExpired: (value: boolean) => set({ sessionExpired: value }),
      setManualLogout: (value: boolean) => set({ manualLogout: value }),

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
          if (!user || user.id !== data.user.id) set({ user: data.user, loading: false, });
          return true;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          toast.error(message);
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
          toast.error(message)
          set({ user: null, loading: false, error: message });
          localStorage.removeItem('user-storage');
        }
      },

      logout: async (isSessionExpired = false) => {
        set({ loading: true });
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          toast.error(message)
        } finally {
          set({ user: null, loading: false, error: null, sessionExpired: isSessionExpired, manualLogout: !isSessionExpired });
          localStorage.removeItem('user-storage');
          sessionStorage.clear();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      storage: encryptedStorage,
      onRehydrateStorage: () => (state) => {
        state?.setRehydrated?.(true);
      },
    }
  )
);