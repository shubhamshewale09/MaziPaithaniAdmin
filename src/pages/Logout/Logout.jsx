import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        logout()
        // localStorage.clear(); // or remove specific keys
        // sessionStorage.clear();
        navigate("/login", { replace: true });
    }, [navigate]);

    return (
        <div className="h-screen flex items-center justify-center text-primary">
            Logging out...
        </div>
    );
};

export default Logout;
