import React, { useContext } from "react";
import "../styles/navbar.css";
import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";

function Navbar() {
    const appDispatch = useContext(DispatchContext);

    const handleLogout = () => {
        if (sessionStorage.getItem("loggedIn") !== "true") {
            console.log(sessionStorage.getItem("loggedIn"));
            return;
        }
        axios.post("http://localhost:8080/logout").then((res) => {
            if (res.status === 200) {
                console.log(res.status);
                appDispatch({ type: "logout" });
                return navigate("/login");
            }
        });
    };

    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-title">Task Management System</div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Navigate to="/usermanagement" className="nav-item">
                        User Management
                    </Navigate>
                </li>
                <li className="nav-item">Profile</li>
                <li className="nav-item" onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
