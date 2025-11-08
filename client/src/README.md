# Overview

This React application provides a campground management platform with user and admin roles. It handles authentication, authorization, campground browsing, booking, and management. The application uses React Router for navigation and `react-hot-toast` for displaying notifications.

# App.jsx

## Purpose

The `App` component serves as the main entry point for the React application. It configures the React Router, defines all application routes, and handles authentication-based route protection. It dictates which components are rendered based on the user's authentication status and role.

## Dependencies

-   **react-router:** Used for declarative routing in React. Provides components like `BrowserRouter`, `Routes`, `Route`, and `Navigate`.
-   **./Pages/Login:** Component for user login.
-   **./Pages/Signup:** Component for user signup.
-   **./Pages/admin/AdminDashboard:** Component for the admin dashboard.
-   **./Pages/UserDashboard:** Component for the user dashboard.
-   **./Pages/Home:** Component for the home page.
-   **./Pages/Profile:** Component for user profile management.
-   **./Pages/CreateCG:** Component for creating a new campground.
-   **./Pages/ViewCampground:** Component for viewing a specific campground.
-   **./Pages/admin/ManageUsers:** Component for managing users (admin only).
-   **./Pages/admin/ManageCampgrounds:** Component for managing campgrounds (admin only).
-   **./Pages/admin/ManageBookings:** Component for managing bookings (admin only).
-   **./Pages/admin/ManageReviews:** Component for managing reviews (admin only).
-   **./Pages/BrowseCampgroundsPage:** Component for browsing all campgrounds.
-   **./Pages/CampgroundBooking:** Component for booking a campground.
-   **./Pages/ManageCampground:** Component for managing a specific campground.
-   **./Pages/NotFound:** Component for handling 404 errors (page not found).
-   **./hooks/useAuthContext:** Custom hook for accessing the authentication context.  *Assumption: This hook provides authentication state and role.*
-   **react-hot-toast:** Library for displaying toast notifications.

## Functionality

-   Uses `BrowserRouter` to enable client-side routing.
-   Defines routes using the `Routes` and `Route` components.
-   Implements authentication and authorization checks using the `useAuthContext` hook to protect routes based on the user's login status and role ("user" or "admin").
-   Uses `Navigate` to redirect users based on their authentication status and role.  *Assumption:  `Navigate` is the `Redirect` component from `react-router-dom` v5.*
-   Renders different components based on the current route, authentication state, and user role.
-   Includes a catch-all route (`*`) that renders the `NotFound` component for any unmatched routes.
-   Renders a `<Toaster />` component for displaying toast notifications from `react-hot-toast`.

## Code Snippet

```jsx
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
import CampgroundBooking from "./Pages/CampgroundBooking";
import ManageCampground from "./Pages/ManageCampground";
import NotFound from "./Pages/NotFound";
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
          <Route
            path="/login"
            element={state?.isAuthenticated ? state?.role === "user" ? <UserDashboard /> : <AdminDashboard /> : <Login />}
          />
```

# main.jsx

## Purpose

This file is the entry point for the React application. It renders the `App` component within a `StrictMode` and wraps it with an `AuthProvider`.

## Dependencies

-   **react:** Core React library.
-   **react-dom/client:** Used for rendering React components in the browser.
-   **./App.jsx:** The main application component.
-   **./context/AuthContext.jsx:** Provides the authentication context to the application. *Assumption: This context likely manages user authentication state.*
-   **./index.css:** Global CSS stylesheet for the application.

## Functionality

-   Imports necessary modules from `react` and `react-dom/client`.
-   Imports the `App` component.
-   Wraps the `App` component with `AuthProvider`, making authentication state available to all components.
-   Enables React's `StrictMode` for additional development checks and warnings.
-   Renders the entire application to the DOM element with the ID "root".

## Code Snippet

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
```

# Dependencies

-   **react:** Core React library for building UI components.
-   **react-dom/client:**  Used for rendering React components in a web browser.
-   **react-router:** Provides routing functionality for single-page applications. *Assumption: Using version 6 based on the import style.*
-   **react-hot-toast:**  For displaying unobtrusive notification messages.

# Assumptions

- The `useAuthContext` hook, defined in `./hooks/useAuthContext`, is responsible for providing the authentication state (`isAuthenticated`) and user role (`role`).
- The `AuthProvider` component, defined in `./context/AuthContext.jsx`, is responsible for managing and providing the authentication context to the application.
- The `Navigate` component used is from `react-router-dom` v6.