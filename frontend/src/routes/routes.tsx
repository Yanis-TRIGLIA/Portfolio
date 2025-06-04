import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Home2 from "../pages/Home2";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      {path: "home", element: <Home2 /> },
      { path: "login", element: <Login /> },
    ],
  },
]);
