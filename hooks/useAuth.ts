'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const isLoading = status === 'loading';
    const isAuthenticated = !!session;
    const user = session?.user;
    const role = user?.role?.toLowerCase();

    const isAdmin = role === 'admin';
    const isFaculty = role === 'faculty';
    const isStudent = role === 'student';

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    const redirectToDashboard = () => {
        switch (role) {
            case 'admin':
                router.push('/admin');
                break;
            case 'faculty':
                router.push('/faculty/dashboard');
                break;
            case 'student':
                router.push('/student/dashboard');
                break;
            default:
                router.push('/login');
        }
    };

    return {
        session,
        user,
        role,
        isLoading,
        isAuthenticated,
        isAdmin,
        isFaculty,
        isStudent,
        logout,
        redirectToDashboard,
        updateSession: update,
    };
}
