import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = (message, type = "success") => {
    toast[type](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

export default ToastNotification;
