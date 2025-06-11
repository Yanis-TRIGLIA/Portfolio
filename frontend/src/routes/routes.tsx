// src/routes/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ProjectDetail from "../pages/ProjectDetail";
import HomeLayout from "../components/basics/HomeLayout";
import Login from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AccessDenied from "../components/auth/AccessDenied";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import BlogDetail from "../pages/BlogDetail";
import Sitemap from "../pages/Sitemap";

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
    path: "plan_du_site",
    element:<Sitemap/>,
  },
  {
    path: "project/:id",
    element: <ProjectDetail />,
  },
  {
    path:"blog/:id",
    element: <BlogDetail />, 
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
