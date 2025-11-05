import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, verifyingToken, setVerifyingToken } = useAuth();

  const handleLogout = async () => {
    try {
      setVerifyingToken(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!data.success) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (err) {
      console.error("Network error. Try again later.");
    } finally {
      setVerifyingToken(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm fixed top-0 left-0 z-50 h-[70px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          AI Summariser
        </Link>

        <nav className="flex items-center gap-6">
          {verifyingToken ? (
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <svg
                className="w-5 h-5 animate-spin text-blue-600"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          ) : !isLoggedIn ? (
            <Link
              to="/login"
              className="flex items-center gap-2 text-slate-700 font-medium hover:text-blue-600 transition"
            >
              <LogIn size={20} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          ) : (
            <>
              <Link
                to="/summaries"
                className="flex items-center gap-2 text-slate-700 font-medium hover:text-blue-600 transition"
              >
                <FileText size={20} />
                <span className="hidden sm:inline">My Summaries</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
