import { lazy } from "react";

const Timetable = lazy(() => import("./Timetable"))
const Tasks = lazy(() => import("./Tasks"));
const Settings = lazy(() => import("./Settings"));
const Login = lazy(() => import("./Authentication/Login"));
const Signup = lazy(() => import("./Authentication/Signup"));
const Verify = lazy(() => import("./Authentication/Verify"));
const Account = lazy(() => import("./Account"));
const Root = lazy(() => import("./Root"));


const routes = [
    {
        name: "timetable",
        element: Timetable,
        path: "/timetable",
        exact: true
    },
    {
        name: "login",
        element: Login,
        path: "/login",
        exact: true
    },
    {
        name: "signup",
        element: Signup,
        path: "/signup",
        exact: true
    },
    {
        name: "verify",
        element: Verify,
        path: "/verify",
        exact: true
    },
    {
        name: "tasks",
        element: Tasks,
        path: "/tasks",
        exact: true
    },
    {
        name: "settings",
        element: Settings,
        path: "/settings",
        exact: true
    },
    {
        name: "account",
        element: Account,
        path: "/account",
        exact: true
    },
    {
        name: "root",
        element: Root,
        path: "/",
        exact: true
    }
];

export default routes;