import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import ToastNotification from "../components/ToastNotification.jsx";
import {useStateContext} from "../context/ContextProvider.jsx";
import axiosClient from "../axios-client.js";

function VerificationCode() {
    const location = useLocation();
    const email = location.state?.email; // Retrieve the email from the state
    const {token, setUser, setToken} = useStateContext();
    const [verificationCode, setVerificationCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            // Redirect to signup if no email is provided
            navigate("/signup");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (token) {
            navigate("/home");
        }
    }, [token, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axiosClient.post('/verify-code', {
            email,
            verification_code: verificationCode,
        })
            .then(({ data }) => {
                    setUser(data.user);
                    setToken(data.token);
                    navigate("/home");
            })
            .catch(err => {
                const response = err.response;

                if (response && response.data && response.data.message) {
                    // Show error message from API response
                    ToastNotification(response.data.message, "error");
                } else {
                    // Fallback error message
                    ToastNotification("An unexpected error occurred!", "error");
                }
            });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f4f4",
                minHeight: "100vh",
            }}
        >
            <ToastContainer />
            <Card
                style={{
                    width: 400,
                    padding: 20,
                    margin: 20,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    borderRadius: 10,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                    >
                        Enter Verification Code
                    </Typography>
                    <Typography
                        variant="body2"
                        align="center"
                        color="textSecondary"
                        gutterBottom
                    >
                        We have sent a 6-digit verification code to <strong>{email}</strong>.
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Verification Code"
                            variant="outlined"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            margin="normal"
                            inputProps={{ maxLength: 6 }}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{
                                marginTop: 10,
                                backgroundColor: "#000000",
                                color: "#ffffff",
                            }}
                        >
                            Verify
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default VerificationCode;