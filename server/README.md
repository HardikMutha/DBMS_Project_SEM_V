# Overview

This project is a backend server built using Express.js, designed to manage campground listings, user authentication, booking, reviews, requests, and administrative tasks. It provides an API for client-side applications to interact with the server-side logic and data.

# Development Setup

To set up the development environment, ensure you have Node.js and npm (or yarn) installed. Follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
    This command installs all necessary packages listed in the `package.json` file.

2.  **Environment Variables:**
    The application relies on environment variables defined in a `.env` file, loaded by `dotenv`. Ensure you have a `.env` file in the root directory with the necessary configuration.
    Specifically, the `PORT` environment variable is used to determine the port on which the server will listen. If `PORT` is not defined, the server defaults to port 3000. Example `.env` file:
    ```
    PORT=8000
    ```

3.  **Run the Application:**
    ```bash
    npm start
    # or
    yarn start
    ```
    This command starts the server, and it will listen for incoming requests on the specified port.

# Route Handlers

The application uses several route handlers to manage different aspects of the application.

*   `/api/auth`: Handles authentication-related routes.
*   `/api/campground`: Handles campground-related routes.
*   `/api/requests`: Handles request-related routes.
*   `/api/review`: Handles review-related routes.
*   `/api/booking`: Handles booking-related routes.
*   `/api/admin`: Handles admin-related routes.

# API Endpoints

*   `GET /api`: Returns "API is running..." to verify the server is operational.

# Code Documentation

## `index.js`

This is the main entry point for the Express.js server.

```javascript
import express from "express";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import authRoutes from "./routes/auth.js";
import bodyParser from "body-parser";
import cors from "cors";
import campgroundRouter from "./routes/campground.js";
import requestRouter from "./routes/request.js";
import reviewRouter from "./routes/review.js";
import bookingRouter from "./routes/booking.js";
import adminRouter from "./routes/admin.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/campground", campgroundRouter);
app.use("/api/requests", requestRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);

app.get("/api", (req, res) => res.send("API is running..."));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
```

**Purpose:**

This file initializes the Express.js application, configures middleware, defines routes, and starts the server.

**Middleware:**

*   `cors({ origin: true })`: Enables Cross-Origin Resource Sharing (CORS) for all origins.
*   `express.json()`: Parses incoming requests with JSON payloads.
*   `express.urlencoded({ extended: true })`: Parses incoming requests with URL-encoded payloads. `extended: true` allows parsing of rich objects and arrays in the URL-encoded format.
*   `bodyParser.json()`: Parses JSON request bodies.  This is redundant, as express.json() already does this.
*   `bodyParser.urlencoded({ extended: true })`: Parses URL-encoded request bodies. This is redundant, as express.urlencoded() already does this.

**Routes:**

The code mounts several route handlers for different API endpoints:

*   `/api/auth`: Handled by `authRoutes`.
*   `/api/campground`: Handled by `campgroundRouter`.
*   `/api/requests`: Handled by `requestRouter`.
*   `/api/review`: Handled by `reviewRouter`.
*   `/api/booking`: Handled by `bookingRouter`.
*   `/api/admin`: Handled by `adminRouter`.

**Port Configuration:**

The server listens on the port specified in the `process.env.PORT` environment variable. If the environment variable is not set, it defaults to port 3000.

# Dependencies

*   **express:** Web application framework for Node.js.
*   **dotenv:** Loads environment variables from a `.env` file.
*   **body-parser:** Middleware to parse request bodies (JSON and URL-encoded). *Note:* This is often not needed, as Express.js has built-in body parsing functionalities.
*   **cors:** Middleware to enable Cross-Origin Resource Sharing (CORS).
*   **./routes/auth.js:** Route handler for authentication.
*   **./routes/campground.js:** Route handler for campground management.
*   **./routes/request.js:** Route handler for handling requests.
*   **./routes/review.js:** Route handler for review management.
*   **./routes/booking.js:** Route handler for booking management.
*   **./routes/admin.js:** Route handler for administrative tasks.

# Assumptions

*   The application uses a `.env` file in the root directory for environment configuration.
*   The route files (`./routes/auth.js`, `./routes/campground.js`, etc.) exist and export valid Express.js route handlers.
*   The application requires Node.js and npm (or yarn) to be installed.
*   The routes are set up to handle specific API functionalities, such as user authentication, campground listing, review management, etc. These functionalities are implemented in their respective route files.
