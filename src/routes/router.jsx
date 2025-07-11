import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound";
import Membership from "../pages/Membership/Membership";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import DashBoard from "../pages/Dashboard/DashBoard";
import PrivateRoute from "./PrivateRoute";


const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path:"membership",
                Component: Membership,
                // element:<PrivateRoute><Membership /></PrivateRoute>,
            },
            {
                path:"register",
                Component: Register,
            },
            {
                path: "join-us",
                Component: Login,
            },
            {
                path:"dashboard",
                Component:DashBoard,
            }

        ]
    },
    {
        path: "*",
        Component: NotFound,
    }
]);

export default router;