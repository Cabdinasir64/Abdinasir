import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/userStore";

export const useAuthInit = () => {
  const router = useRouter();
  const { user, loading, error, fetchUser } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        await useUserStore.persist?.rehydrate();
        
        if (!mounted) return;

        const currentUser = useUserStore.getState().user;
        
        if (currentUser) {
          setIsInitialized(true);
          return;
        }

        await fetchUser();
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
  }, []);

  useEffect(() => {
    if (isInitialized && !user && !loading && error) {
      toast.error("Please log in to access the admin panel");
      router.push("/login");
    }
  }, [isInitialized, user, loading, error, router]);

  return { 
    isInitialized, 
    user, 
    loading: loading || !isInitialized,
    error 
  };
};