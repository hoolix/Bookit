import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignup from "./pages/LoginSignup";
import Home from "./pages/Home";
import VerificationCode from "./pages/VerificationCode";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Route for the Login and Signup Page */}
                <Route path="/" element={<LoginSignup />} />
                <Route path="/signup" element={<LoginSignup />} />

                <Route path="/verify" element={<VerificationCode />} />

                {/* Route for the Home Page */}
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}