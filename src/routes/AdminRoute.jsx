import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import { USER_ROLES } from "../constants/roles";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/join-us" state={{ from: location }} replace />;
    }

    // Check if user has admin role
    if (user.role !== USER_ROLES.ADMIN) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute;
