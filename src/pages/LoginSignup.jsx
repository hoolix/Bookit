import React, {useEffect, useState} from "react";
import {
    Button,
    TextField,
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Box
} from "@mui/material";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {useNavigate} from "react-router-dom";

function LoginSignup() {
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const navigate = useNavigate();

    const handleGoogleSignIn = (credentialResponse) => {
        console.log(credentialResponse);
        const decodedToken = jwtDecode(credentialResponse.credential); // Decode the JWT token
        console.log(decodedToken);
        const userName = decodedToken.name; // Extract the full name
        alert(`Hi ${userName}`); // Display alert with "Hi" and the user's full name
        navigate("/home");
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isSignup && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        alert(`${isSignup ? "Signup" : "Login"} with email: ${email}`);
    };

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Determine button width based on screen size
    const buttonWidth = windowWidth < 600 ? "100%" : "325px"; // Mobile: <600px, Desktop: 325px

    return (

        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f4f4f4"
        }}>
            <Card style={{ width: 400, padding: 20, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: 10 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        {isSignup ? "Sign Up" : "Login"}
                    </Typography>
                    <form onSubmit={handleFormSubmit}>
                        {isSignup && (
                            <>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <TextField
                                        fullWidth
                                        label="Business Name"
                                        variant="outlined"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        select
                                        fullWidth
                                        label="Business Type"
                                        variant="outlined"
                                        value={businessType}
                                        onChange={(e) => setBusinessType(e.target.value)}
                                        margin="normal"
                                        required
                                    >
                                        <MenuItem value="Retail">Retail</MenuItem>
                                        <MenuItem value="Service">Service</MenuItem>
                                    </TextField>
                                </div>
                                <TextField
                                    fullWidth
                                    type="tel"
                                    label="Phone"
                                    variant="outlined"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    margin="normal"
                                    required
                                />
                            </>
                        )}
                        <TextField
                            fullWidth
                            type="email"
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                        {!isSignup && (
                            <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                margin="normal"
                                required
                            />
                        )}
                        {!isSignup && (
                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                        )}
                        {isSignup && (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Confirm Password"
                                    variant="outlined"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    margin="normal"
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <FormControlLabel
                                control={<Checkbox checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />}
                                label="I accept the terms and conditions"
                            />
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{
                                marginTop: 10,
                                backgroundColor: isSignup ? "#000000" : undefined,
                                color: isSignup ? "#ffffff" : undefined,
                            }}
                        >
                            {isSignup ? "Sign Up" : "Login"}
                        </Button>
                    </form>

                    {/* Google Sign-In Button */}
                    <Box width="100%"  display="flex"
                         justifyContent="center"
                         alignItems="center" marginTop={2}>
                        <GoogleLogin
                            onSuccess={handleGoogleSignIn}
                            onError={() => alert("Error during Google Sign-in")}
                            useOneTap
                            shape="rectangular"
                            size="large"
                            text="signin_with"
                            theme="outline"
                            width={buttonWidth}

                        />
                    </Box>

                    <Typography align="center" style={{ marginTop: 10 }}>
                        {isSignup ? "Already have an account?" : "Don't have an account?"}
                        <span
                            style={{ color: "#1976d2", cursor: "pointer", fontWeight: "bold" }}
                            onClick={() => setIsSignup(!isSignup)}
                        >
                                {isSignup ? " Login" : " Sign Up"}
                            </span>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginSignup;