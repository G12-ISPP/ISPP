import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
            : null
    );
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        const petition = `${backend}/api/v1/token/`.replace(/"/g, "");

        try {
            const response = await fetch(petition, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
                navigate("/");
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            alert("Error during login");
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/");
    };

    const updateTokens = async () => {
        const petition = `${backend}/api/v1/token/refresh/`.replace(/"/g, "");

        try {
            const response = await fetch(petition, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: authTokens?.refresh,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
            } else {
                logoutUser();
            }

            if (loading) {
                setLoading(false);
            }
        } catch (error) {
            logoutUser();
        }
    };

    useEffect(() => {
        const fourMinutes = 1000 * 60 * 4;
        const interval = setInterval(() => {
            if (authTokens) {
                updateTokens();
            }
        }, fourMinutes);

        return () => clearInterval(interval);
    }, [authTokens, loading]);

    const contextData = {
        user,
        loginUser,
        logoutUser,
        authTokens,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
