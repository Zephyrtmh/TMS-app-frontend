import React, { useContext } from "react";
import "../styles/navbar.css";
import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import AppStateContext from "../AppStateContext";

function Navbar() {
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
            }
        });
    };

    const handleNavigateToEditUser = () => {
        navigate(`/user/${appState.username}`);
    };

    const handleNavigation = () => {
        // console.log(route);
        return navigate("/usermanagement");
    };

    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-title">Task Management System</div>
            <ul className="navbar-nav">
                <li className="nav-item" onClick={handleNavigation}>
                    User Management
                </li>
                <li className="nav-item" onClick={handleNavigateToEditUser}>
                    Profile
                </li>
                <li className="nav-item" onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
