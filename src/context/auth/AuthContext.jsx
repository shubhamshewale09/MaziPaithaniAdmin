import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("login")
    );

    const login = (token) => {

        localStorage.setItem("login", JSON.stringify(token));
        setIsAuthenticated(true);
    };

    const logout = () => {

        localStorage.removeItem("login");
        setIsAuthenticated(false);
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
