import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/data";
import LOGO from "../../assets/light.png";
import lines from "../../assets/lines.svg";
import Loader from "../Loader";

const Login = () => {
  const { authURL } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Attempting to login...");

    try {
      const response = await fetch(`${authURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(toastId); // Ensure it dismisses the loading state first
        if (response.status === 400) {
          toast.error("Incorrect username or password");
        } else {
          toast.error(data.message || "Login failed");
        }
        return;
      }

      if (!data.token) {
        toast.error("No authentication token received");
        return;
      }

      localStorage.setItem("token", data.token);
      toast.dismiss(toastId);
      toast.success("Welcome to BZ-Softech Dashboard!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred", {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-950 relative h-screen overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <img
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
        src={lines}
        alt=""
      />
      <div className="flex items-center justify-center h-full container mx-auto px-4">
        <div className="max-w-sm mx-auto relative z-50 w-full">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl">
            <div className="flex flex-col items-center mb-8">
              <img
                src={LOGO}
                alt="BZ Soft-Tech Logo"
                className="w-24 mx-auto hover:scale-105 transition-transform duration-300"
              />
              <p className="text-center mt-4 text-gray-300 uppercase text-sm tracking-wider font-medium">
                Login to Administrator Account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mt-6 flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <p className="mt-8 text-xs text-center text-gray-500">
              © {new Date().getFullYear()} BZ SOFTECH. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
