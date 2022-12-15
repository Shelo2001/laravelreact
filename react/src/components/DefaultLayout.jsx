import React, { useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axiosclient";
import { useStateContext } from "../contexts/ContextProvider";

const DefaultLayout = () => {
    const { user, notification, token, setToken, setUser } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    const logoutHandler = (e) => {
        e.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>ADMIN PANEL</div>
                    <div>
                        {user.name}
                        <a
                            href="#"
                            className="btn-logout"
                            onClick={logoutHandler}
                        >
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>

            {notification && <div className="notification">{notification}</div>}
        </div>
    );
};

export default DefaultLayout;
