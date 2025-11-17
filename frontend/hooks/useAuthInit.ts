import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/userStore";

export const useAuthInit = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, error, isRehydrated, checkAuth, sessionExpired, setSessionExpired, manualLogout, setManualLogout } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const publicRoutes = ['/login', '/register', '/forgot-password'];
        const isPublicRoute = publicRoutes.includes(pathname);

        if (isPublicRoute) {
          setIsInitialized(true);
          return;
        }

        if (!isRehydrated) {
          const timeout = setTimeout(() => {
            if (mounted) setIsInitialized(true);
          }, 2000);
          return () => clearTimeout(timeout);
        }

        const isAuthenticated = await checkAuth();

        if (!mounted) return;

        if (!isAuthenticated && !isPublicRoute) {
          router.push('/login');
        }

        setIsInitialized(true);

      } catch (err) {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [isRehydrated, pathname, checkAuth, router]);

  useEffect(() => {
    if (!isInitialized) return;


    const publicRoutes = ['/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute && !loading) {
      if (sessionExpired) {
        toast.error("Session expired. Please log in again.");
        setSessionExpired(false);
      } else if (manualLogout) {
        setManualLogout(false);
      } else {
        toast.error("You must be logged in to access this page.");
      }
      router.push('/login');
    }

    if (user && pathname === '/login') {
      router.push('/admin/dashboard');
    }

  }, [isInitialized, user, loading, pathname, router]);

  return {
    isInitialized,
    user,
    loading: loading || !isInitialized,
    error
  };
};