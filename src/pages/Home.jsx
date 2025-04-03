import { Box, Button } from "@mui/material";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";
import {useEffect} from "react";
import axiosClient from "../axios-client.js";
import ToastNotification from "../components/ToastNotification.jsx";

function LoginSignup() {
    const navigate = useNavigate();
    const { token, setToken, setUser } = useStateContext();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    const logout = () => {
        axiosClient.post("/logout")
            .then(({ data }) => {
                ToastNotification(data.message, "success"); // Show success toast
            })
            .catch(err => {
                const response = err.response;
                if (response && response.data && response.data.message) {
                    ToastNotification(response.data.message, "error"); // Show error message
                } else {
                    ToastNotification("An unexpected error occurred!", "error");
                }
            })
            .finally(() => {
                // Ensure user is logged out in frontend, even if request fails
                googleLogout();
                setToken(null);
                setUser(null);
                navigate("/");
            });
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Button variant="contained" onClick={logout}>Logout</Button>
        </Box>
    );
}

export default LoginSignup;
