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
import BrowseCampgroundsPage from "./Pages/BrowseCampgroundsPage";
import useAuthContext from "./hooks/useAuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { state } = useAuthContext();
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
                  <Navigate to="/login" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={state?.isAuthenticated && state?.role === "admin" ? <AdminDashboard /> : <Login />}
          />
          <Route
            path="/admin/manage-users"
            element={state?.isAuthenticated && state?.role === "admin" ? <ManageUsers /> : <Login />}
          />
          <Route
            path="/admin/manage-campgrounds"
            element={state?.isAuthenticated && state?.role === "admin" ? <ManageCampgrounds /> : <Login />}
          />
          <Route
            path="/admin/manage-bookings"
            element={state?.isAuthenticated && state?.role === "admin" ? <ManageBookings /> : <Login />}
          />
          <Route
            path="/admin/manage-reviews"
            element={state?.isAuthenticated && state?.role === "admin" ? <ManageReviews /> : <Login />}
          />
          <Route
            path="/user/dashboard"
            element={state?.isAuthenticated && state?.role === "user" ? <UserDashboard /> : <Login />}
          />
          <Route path="/user/createcg" element={state?.isAuthenticated ? <CreateCG /> : <Login />} />
          <Route path="/campground/:id" element={<ViewCampground />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
