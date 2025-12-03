import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import CreateCG from "./Pages/CreateCG";
import ViewCampground from "./Pages/ViewCampground";
import ManageUsers from "./Pages/admin/ManageUsers";
import ManageCampgrounds from "./Pages/admin/ManageCampgrounds";
import ManageBookings from "./Pages/admin/ManageBookings";
import ManageReviews from "./Pages/admin/ManageReviews";
import ManageRequests from "./Pages/admin/ManageRequests";
import BrowseCampgroundsPage from "./Pages/BrowseCampgrounds";
import CampgroundBooking from "./Pages/CampgroundBooking";
import ManageCampground from "./Pages/ManageCampground";
import NotFound from "./Pages/NotFound";
import useAuthContext from "./hooks/useAuthContext";
import toast, { Toaster } from "react-hot-toast";

function RedirectWithToast({ message = "Please login to continue" }) {
  useEffect(() => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "#fff",
        padding: "16px 20px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    });
  }, []);

  return <Navigate to="/login" replace />;
}

function App() {
  const { state } = useAuthContext();
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={state?.isAuthenticated ? state?.role === "user" ? <UserDashboard /> : <AdminDashboard /> : <Login />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/campgrounds" element={<BrowseCampgroundsPage />} />
          <Route
            path="/profile"
            element={
              state?.isAuthenticated ? (
                state?.role === "user" ? (
                  <Profile />
                ) : state?.role === "admin" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <RedirectWithToast message="Please login to view your profile" />
                )
              ) : (
                <RedirectWithToast message="Please login to view your profile" />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              state?.isAuthenticated && state?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <RedirectWithToast message="Admin access required" />
              )
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              state?.isAuthenticated && state?.role === "admin" ? (
                <ManageUsers />
              ) : (
                <RedirectWithToast message="Admin access required" />
              )
            }
          />
          <Route
            path="/admin/manage-campgrounds"
            element={
              state?.isAuthenticated && state?.role === "admin" ? (
                <ManageCampgrounds />
              ) : (
                <RedirectWithToast message="Admin access required" />
              )
            }
          />
          <Route
            path="/admin/manage-bookings"
            element={
              state?.isAuthenticated && state?.role === "admin" ? (
                <ManageBookings />
              ) : (
                <RedirectWithToast message="Admin access required" />
              )
            }
          />
          <Route
            path="/admin/manage-reviews"
            element={
              state?.isAuthenticated && state?.role === "admin" ? (
                <ManageReviews />
              ) : (
                <RedirectWithToast message="Admin access required" />
              )
            }
          />
          <Route
            path="/admin/manage-requests"
            element={
              state?.isAuthenticated && state?.role === "admin" ? (
                <ManageRequests />
              ) : (
                <RedirectWithToast message="Admin access required" />
              )
            }
          />
          <Route
            path="/user/dashboard"
            element={
              state?.isAuthenticated && state?.role === "user" ? (
                <UserDashboard />
              ) : (
                <RedirectWithToast message="Please login to access your dashboard" />
              )
            }
          />
          <Route
            path="/user/createcg"
            element={state?.isAuthenticated ? <CreateCG /> : <RedirectWithToast message="Please login to create a campground" />}
          />
          <Route path="/campground/:id" element={<ViewCampground />} />
          <Route path="/campground/:id/book" element={<CampgroundBooking />} />
          <Route
            path="/campground/:id/manage"
            element={
              state?.isAuthenticated ? (
                <ManageCampground />
              ) : (
                <RedirectWithToast message="Please login to manage your campground" />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
