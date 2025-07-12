import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound";
import Membership from "../pages/Membership/Membership";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import PostDetails from "../pages/Post/PostDetails";
import DashBoard from "../pages/Dashboard/DashBoard";
import MyProfile from "../pages/Dashboard/MyProfile";
import AddPost from "../pages/Dashboard/AddPost";
import MyPosts from "../pages/Dashboard/MyPosts";
import AdminProfile from "../pages/Dashboard/AdminProfile";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layout/DashboardLayout";


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
                path: "post/:postId",
                Component: PostDetails,
            },
            // {
            //     path:"dashboard",
            //     Component:DashBoard,
            // },
            // {
            //     path: "dashboardlayout",
            //     Component: DashboardLayout,
            // }

        ]
    },
    {
        path: "/dashboard",
        element:<PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                Component: DashBoard,
            },
            {
                path: "profile",
                Component: MyProfile,
            },
            {
                path: "add-post",
                Component: AddPost,
            },
            {
                path: "my-posts",
                Component: MyPosts,
            },
            {
                path: "admin-profile",
                Component: AdminProfile,
            },
            {
                path: "manage-users",
                Component: ManageUsers,
            },
        ]
    },
    {
        path: "*",
        Component: NotFound,
    }
]);

export default router;