import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound";
import Membership from "../pages/Membership/Membership";
import Register from "../pages/Auth/Register";


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
            },
            {
                path:"register",
                Component: Register,
            }

        ]
    },
    {
        path: "*",
        Component: NotFound,
    }
]);

export default router;