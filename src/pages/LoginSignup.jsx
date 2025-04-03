import {useEffect, useState} from "react";
import {
    Button, TextField, Card, CardContent, Typography,
    FormControlLabel, Checkbox, MenuItem, Box
} from "@mui/material";
import {GoogleLogin} from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";
import {useLocation, useNavigate} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import {ToastContainer} from "react-toastify";
import ToastNotification from "../components/ToastNotification.jsx";

function LoginSignup() {
    const [formData, setFormData] = useState({
        businessName: "", businessType: "", phone: "",
        username: "", email: "", password: "", password_confirmation: "",
        acceptTerms: false
    });
    const [isSignup, setIsSignup] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const {token, setUser, setToken} = useStateContext();
    const [errors, setErrors] = useState(null);
    const [businessTypes, setBusinessTypes] = useState([]);
    const location = useLocation(); // Get current URL path

    useEffect(() => {
        if (token) {
            navigate("/home");
        }
    }, [token, navigate]);


    const handleToggleForm = () => {
        setIsSignup(!isSignup);

        // Update the URL without triggering navigation
        if (!isSignup) {
            window.history.pushState(null, '', '/signup');
        } else {
            window.history.pushState(null, '', '/');
        }
    };

    const fetchBusinessTypes = async () => {
        axiosClient.get('/business-types')
            .then(({data}) => {
                setBusinessTypes(data.data);
                ToastNotification(data.message);
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
            })
    };

    // Fetch business types from the backend
    useEffect(() => {
        fetchBusinessTypes();

        if (location.pathname === "/signup") {
            setIsSignup(true);
        } else {
            setIsSignup(false);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleGoogleSignIn = async (credentialResponse) => {
        const {name, email} = jwtDecode(credentialResponse.credential);

        axiosClient.post('/googleLogin', {username: name, email})
            .then(({data}) => {
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
            })

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (isSignup && formData.password !== formData.password_confirmation) {
        //     alert("Passwords do not match");
        //     return;
        // }

        const endpoint = isSignup ? "/signup" : "/login";

        const payload = isSignup
            ? formData
            : {email: formData.email, username: formData.username, password: formData.password};


        console.log(payload);
        axiosClient.post(endpoint, payload)
            .then(({data}) => {
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
            })

    };


    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f4f4f4",
            minHeight: "100vh",
        }}>
            <ToastContainer/>
            <Card style={{width: 400, padding: 20, margin: 20, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: 10}}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>{isSignup ? "Sign Up" : "Login"}</Typography>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <>
                                <div style={{display: "flex", gap: "10px"}}>
                                    <TextField fullWidth label="Business Name" name="businessName" variant="outlined"
                                               value={formData.businessName} onChange={handleChange} margin="normal"
                                               required/>
                                    <TextField select fullWidth label="Business Type" name="businessType"
                                               variant="outlined" value={formData.businessType} onChange={handleChange}
                                               margin="normal" required>
                                        {businessTypes.length > 0 ? (
                                            businessTypes.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.name}  {/* Assuming the model has `id` and `name` properties */}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No business types available</MenuItem>
                                        )}
                                    </TextField>
                                </div>
                                <TextField fullWidth type="tel" label="Phone" name="phone" variant="outlined"
                                           value={formData.phone} onChange={handleChange} margin="normal" required/>
                            </>
                        )}
                        <TextField fullWidth type="email" label="Email" name="email" variant="outlined"
                                   value={formData.email} onChange={handleChange} margin="normal" required/>

                        <TextField fullWidth label="Username" name="username" variant="outlined"
                                       value={formData.username} onChange={handleChange} margin="normal" required/>

                        {!isSignup && (
                            <TextField fullWidth type="password" label="Password" name="password" variant="outlined"
                                       value={formData.password} onChange={handleChange} margin="normal" required/>
                        )}
                        {isSignup && (
                            <div style={{display: "flex", gap: "10px"}}>
                                <TextField fullWidth type="password" label="Password" name="password" variant="outlined"
                                           value={formData.password} onChange={handleChange} margin="normal" required/>
                                <TextField fullWidth type="password" label="Confirm Password" name="password_confirmation"
                                           variant="outlined" value={formData.password_confirmation} onChange={handleChange}
                                           margin="normal" required/>
                            </div>
                        )}
                        {isSignup && (
                            <FormControlLabel control={<Checkbox checked={formData.acceptTerms}
                                                                 onChange={e => setFormData({
                                                                     ...formData,
                                                                     acceptTerms: e.target.checked
                                                                 })}/>} label="I accept the terms and conditions"/>
                        )}
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{
                            marginTop: 10,
                            backgroundColor: isSignup ? "#000000" : undefined,
                            color: isSignup ? "#ffffff" : undefined
                        }}>
                            {isSignup ? "Sign Up" : "Login"}
                        </Button>
                    </form>

                    <Box width="100%" display="flex" justifyContent="center" alignItems="center" marginTop={2}>
                        <GoogleLogin onSuccess={handleGoogleSignIn} onError={() => alert("Google Sign-in Failed")}
                                     useOneTap shape="rectangular" size="large" text="signin_with" theme="outline"
                                     width={windowWidth < 600 ? "100%" : "325px"}/>
                    </Box>

                    <Typography align="center" style={{marginTop: 10}}>
                        {isSignup ? "Already have an account?" : "Don't have an account?"}
                        <span style={{color: "#1976d2", cursor: "pointer", fontWeight: "bold"}}
                              onClick={handleToggleForm}>
                            {isSignup ? " Login" : " Sign Up"}
                        </span>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default LoginSignup;
