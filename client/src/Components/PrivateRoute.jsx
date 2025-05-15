import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PrivateRoute = () => {
    const {token, loading} = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    return token ? children : <Navigate to="/" replace />;
}
 
export default PrivateRoute;