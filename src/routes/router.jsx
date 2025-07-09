import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound";
import Membership from "../pages/Membership/Membership";


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
            }

        ]
    },
    {
        path: "*",
        Component: NotFound,
    }
]);

export default router;