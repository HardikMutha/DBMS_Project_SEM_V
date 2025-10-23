import React from "react";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const UserDashboard = () => {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-gray-800 text-3xl font-bold m-0">User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600 text-white border-none rounded-lg cursor-pointer text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="p-5 bg-gray-50 rounded-lg mb-5">
          <h3 className="mt-0 text-xl font-semibold text-gray-800">Welcome, {state.user?.username}!</h3>
          <p className="my-2.5 text-gray-700">
            <strong>Email:</strong> {state.user?.email}
          </p>
          <p className="my-2.5 text-gray-700">
            <strong>Role:</strong>{" "}
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">USER</span>
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-gray-700 text-2xl font-semibold mb-5">Your Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-green-50 rounded-lg border-2 border-green-500">
              <h3 className="mt-0 text-lg font-semibold text-gray-800">Browse Campgrounds</h3>
              <p className="text-gray-600 text-sm">Explore available camping locations</p>
            </div>
            <div className="p-5 bg-green-50 rounded-lg border-2 border-green-500">
              <h3 className="mt-0 text-lg font-semibold text-gray-800">My Bookings</h3>
              <p className="text-gray-600 text-sm">View and manage your reservations</p>
            </div>
            <div className="p-5 bg-green-50 rounded-lg border-2 border-green-500">
              <h3 className="mt-0 text-lg font-semibold text-gray-800">Write Reviews</h3>
              <p className="text-gray-600 text-sm">Share your camping experiences</p>
            </div>
            <div className="p-5 bg-green-50 rounded-lg border-2 border-green-500">
              <h3 className="mt-0 text-lg font-semibold text-gray-800">Profile Settings</h3>
              <p className="text-gray-600 text-sm">Update your account information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
