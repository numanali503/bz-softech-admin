import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import { useAuth } from "../context/data";

const ProtectedRoute = ({ Component }) => {
  const { authURL } = useAuth();
  const location = useLocation();
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found in localStorage");
          throw new Error("No token found");
        }

        const response = await fetch(`${authURL}/auth/protected`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!isMounted) return;

        switch (response.status) {
          case 200:
            setAuthState({ isLoading: false, isAuthenticated: true });
            break;
          case 401:
            localStorage.removeItem("token");
            throw new Error("Session expired. Please login again.");
          case 403:
            throw new Error(
              "Access forbidden. You do not have permission to access this page."
            );
          case 404:
            throw new Error("API endpoint not found. Please contact support.");
          default:
            throw new Error("Something went wrong. Please try again later.");
        }
      } catch (error) {
        console.error("Protected route error:", error.message);

        if (!isMounted) return;

        if (error.message !== "No token found") {
          toast.error(error.message);
        }

        setAuthState({ isLoading: false, isAuthenticated: false });
        localStorage.removeItem("token");
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [authURL]);

  if (authState.isLoading) {
    return <Loader />;
  }

  if (!authState.isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <Navigate to="/" state={{ from: location.pathname }} replace />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Component />
    </>
  );
};

export default ProtectedRoute;
