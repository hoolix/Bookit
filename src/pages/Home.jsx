import {Box, Button} from "@mui/material";
import { googleLogout } from '@react-oauth/google';
import {useNavigate} from "react-router-dom";

function LoginSignup() {
    const navigate = useNavigate();

    const logout = () => {
        googleLogout();
        navigate("/");
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Button variant="contained" onClick={logout}>Logout</Button>
        </Box>
    );
}

export default LoginSignup;