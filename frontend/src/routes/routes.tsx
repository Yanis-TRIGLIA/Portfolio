// src/routes/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ProjectDetail from "../pages/ProjectDetail";
import HomeLayout from "../components/basics/HomeLayout";
import Login from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AccessDenied from "../components/auth/AccessDenied";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "project/:id",
    element: <ProjectDetail />,
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "access-denied",
    element: <AccessDenied />,
  },
]);
