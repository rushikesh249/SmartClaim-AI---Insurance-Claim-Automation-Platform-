import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute() {
    const { isAuthenticated, initAuth, isInitializing, user } = useAuthStore();

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    // Show loading state while initializing auth
    if (isInitializing) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="space-y-4 w-[300px]">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-[250px] mx-auto" />
                    <Skeleton className="h-4 w-[200px] mx-auto" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}