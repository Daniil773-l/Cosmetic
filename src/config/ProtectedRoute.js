import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.role !== "admin") {
        return <Navigate to="/регистрация" />;
    }

    return children;
};

export default ProtectedRoute;
