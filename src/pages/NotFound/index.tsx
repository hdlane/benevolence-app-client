import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-red-500">404</h1>
                <p className="mt-4 text-2xl font-semibold text-gray-800">
                    Oops! Page not found.
                </p>
                <p className="mt-2 text-gray-600">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>
                <button
                    className="button-primary mt-6 inline-block px-6 py-3 text-lg font-medium text-white rounded"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
