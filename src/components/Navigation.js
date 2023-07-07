import React, { useContext, useEffect } from "react";
import "../styles/navbar.css";
import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import AppStateContext from "../AppStateContext";

function Navbar() {
    useEffect(() => {
        console.log("usergroup: " + appState.userGroups);
        console.log(appState);
    }, [appState]);

    const appDispatch = useContext(DispatchContext);
    const appState = useContext(AppStateContext);

    const handleLogout = () => {
        // if (sessionStorage.getItem("loggedIn") !== "true") {
        //     console.log(sessionStorage.getItem("loggedIn"));
        //     return;
        // }
        axios.post("http://localhost:8080/logout", {}, { withCredentials: true }).then((res) => {
            if (res.status === 200) {
                console.log(res.status);
                appDispatch({ type: "logout" });
                return navigate("/login");
            } else if (res.status !== 200) {
                return navigate("/login");
            }
        });
    };

    const handleNavigateToEditUser = () => {
        return navigate(`/profile/${appState.username}`);
    };

    const handleNavigationUserManagement = () => {
        return navigate("/usermanagement");
    };

    const handleNavigationApplicationManagement = () => {
        return navigate("/applicationmanagement");
    };

    const handleNavigationHome = () => {
        return navigate("/home");
    };

    const handleNavigateLogin = () => {
        return navigate("/login");
    };

    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-title" onClick={handleNavigationHome}>
                Task Management System
            </div>
            <ul className="navbar-nav">
                {appState.userGroups.includes("project lead") && (
                    <li className="nav-item" onClick={handleNavigationApplicationManagement}>
                        Application Management
                    </li>
                )}
                {appState.userGroups.includes("admin") && (
                    <li className="nav-item" onClick={handleNavigationUserManagement}>
                        User Management
                    </li>
                )}
                {appState.loggedIn && (
                    <li className="nav-item" onClick={handleNavigateToEditUser}>
                        Profile
                    </li>
                )}
                {appState.loggedIn && (
                    <li className="nav-item" onClick={handleLogout}>
                        Logout
                    </li>
                )}
                {!appState.loggedIn && (
                    <li className="nav-item" onClick={handleNavigateLogin}>
                        Login
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
