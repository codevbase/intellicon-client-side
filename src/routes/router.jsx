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
import Reports from "../pages/Dashboard/Reports";
import AdminAnnouncements from "../pages/Dashboard/AdminAnnouncements";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import MakeAnnouncement from "../pages/Admin/MakeAnnouncement";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "../layout/DashboardLayout";
import AdminLayout from "../layout/AdminLayout";
import CommentsPage from "../pages/Post/CommentsPage";
import ToastTest from "../components/ToastTest";
import ApiTest from "../components/ApiTest";
import AdminTest from "../components/AdminTest";
import AdminSetup from "../components/AdminSetup";
import Notification from "../pages/Dashboard/Notification";



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
            {
                path: "comments/:postId",
                Component: CommentsPage,
            },
            {
                path: "notification",
                Component: Notification,

            },
            {
                path: "test-toast",
                Component: ToastTest,
            },
            {
                path: "test-api",
                Component: ApiTest,
            },
            {
                path: "admin-test",
                Component: AdminTest,
            },
            {
                path: "admin-setup",
                Component: AdminSetup,
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
                element: <AdminRoute><AdminProfile /></AdminRoute>,
            },
            {
                path: "manage-users",
                element: <AdminRoute><ManageUsers /></AdminRoute>,
            },
            // {
            //     path: "reports",
            //     element: <AdminRoute><Reports /></AdminRoute>,
            // },
            {
                path: "announcements",
                element: <AdminRoute><AdminAnnouncements /></AdminRoute>,
            },
        ]
    },
    {
        path: "/admin",
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
            {
                index: true,
                Component: AdminDashboard,
            },
            {
                path: "users",
                Component: AdminUsers,
            },
            {
                path: "make-announcement",
                Component: MakeAnnouncement,
            },
            {
                path: "announcements",
                element: <AdminAnnouncements />,
            },
            {
                path: "posts/reported-comments",
                element: <Reports />,
            },
            {
                path: "profile",
                element: <AdminProfile />,
            },
            
        ]
    },
    {
        path: "*",
        Component: NotFound,
    }
]);

export default router;