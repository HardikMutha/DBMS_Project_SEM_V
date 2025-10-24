import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminDashboard from "./Pages/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";
import useAuthContext from "./hooks/useAuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { state } = useAuthContext();
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin/dashboard"
            element={state?.isAuthenticated && state?.role === "admin" ? <AdminDashboard /> : <Login />}
          />
          <Route
            path="/user/dashboard"
            element={state?.isAuthenticated && state?.role === "user" ? <UserDashboard /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
