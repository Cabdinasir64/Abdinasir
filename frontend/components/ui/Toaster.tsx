"use client";
import { Toaster as ReactHotToaster, toast } from "react-hot-toast";

export const successToast = (message: string) => {
    toast.success(message, {
        icon: "✅",
        style: {
            background: "#ECFDF5",
            color: "#065F46",
            border: "1px solid #A7F3D0",
            borderRadius: "12px",
            padding: "12px 16px",
            fontWeight: 500,
            fontSize: "14px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        },
        duration: 5000,
    });
};

export const warningToast = (message: string) => {
    toast(message, {
        icon: "⚠️",
        style: {
            background: "#FFFBEB",
            color: "#92400E",
            border: "1px solid #FDE68A",
            borderRadius: "12px",
            padding: "12px 16px",
            fontWeight: 500,
            fontSize: "14px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        },
        duration: 5000,
    });
};

export const loadingToast = (message: string) => {
    toast.loading(message, {
        style: {
            background: "#EEF2FF",
            color: "#3730A3",
            border: "1px solid #C7D2FE",
            borderRadius: "12px",
            padding: "12px 16px",
            fontWeight: 500,
            fontSize: "14px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        },
        duration: 5000,
    });
};

export const errorToast = (message: string) => {
    toast.error(message, {
        icon: "❌",
        style: {
            background: "#FEF2F2",
            color: "#991B1B",
            border: "1px solid #FECACA",
            borderRadius: "12px",
            padding: "12px 16px",
            fontWeight: 500,
            fontSize: "14px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        },
        duration: 5000,
    });
};

const Toaster = () => {
    return (
        <ReactHotToaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontWeight: 500,
                    fontSize: "14px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                },
            }}
        />
    );
};

export default Toaster;
