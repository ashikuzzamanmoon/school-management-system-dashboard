import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem('accessToken');
    
    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ['me'],
        queryFn: userService.getMe,
        enabled: !!token,
        retry: false
    });

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Only redirect to login if there's an error fetching user data or it's clearly missing after loading
    if (isError || !userData) {
        return <Navigate to="/login" replace />;
    }

    const userRole = (userData?.user?.role || userData?.role || '').toLowerCase();

    if (!userRole) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        // If they don't have permission for this specific route, redirect back to home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
