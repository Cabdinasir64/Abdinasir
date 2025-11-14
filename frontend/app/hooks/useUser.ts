import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
    id: string;
    username: string;
    email: string;
    profileImage?: string;
}

interface UserResponse {
    user: User;
}

const fetchUser = async (): Promise<UserResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
};

export function useUser() {
    return useQuery<UserResponse>({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, void>({
        mutationFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to logout");
            return true;
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["user"] });
        },
    });
}