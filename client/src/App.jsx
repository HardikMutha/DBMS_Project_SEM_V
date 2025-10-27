import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminDashboard from "./Pages/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import CreateCG from "./Pages/CreateCG";
import ViewCampground from "./Pages/ViewCampground";
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
          <Route path="/profile" element={state?.isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
          <Route
            path="/admin/dashboard"
            element={state?.isAuthenticated && state?.role === "admin" ? <AdminDashboard /> : <Login />}
          />
          <Route
            path="/user/dashboard"
            element={state?.isAuthenticated && state?.role === "user" ? <UserDashboard /> : <Login />}
          />
          <Route path="/user/createcg" element={state?.isAuthenticated && state?.role === "user" ? <CreateCG /> : <Login />} />
          <Route
            path="/campground/:id"
            element={state?.isAuthenticated ? <ViewCampground /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
