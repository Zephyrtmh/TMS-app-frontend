import React, { useState, useContext, useEffect } from "react";
import "../styles/loginpage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DispatchContext from "../DispatchContext";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [buttonIsClicked, setButtonIsClicked] = useState(false);

    const appDispatch = useContext(DispatchContext);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
        console.log("this is loaded");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonIsClicked(true);
        // Handle login logic here
        setShowSuccess(false);
        setShowError(false);
        //send request to backend to login
        const loginData = {
            username: username,
            password: password,
        };
        axios
            .post("http://localhost:8080/login", loginData, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                if (res.status === 200) {
                    if (res.data.success) {
                        const data = res.data;
                        console.log("data");
                        console.log(data.userGroups);
                        appDispatch({ type: "login", data: { username: data.username, active: data.active, userGroups: data.userGroups } });
                        // localStorage.setItem("username", data.username);
                        // localStorage.setItem("active", data.active);
                        // localStorage.setItem("userGroup", data.userGroup);
                        setShowSuccess(true);
                        return navigate("/home");
                    } else {
                        setShowError(true);
                        return;
                    }
                }
            })
            .catch((error) => {
                setErrorMessage(error.response.data.reason);
                setShowError(true);
            });

        // Reset form
        setUsername("");
        setPassword("");
    };

    const navigate = useNavigate();

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={handleUsernameChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} required />
                </div>
                {showError && <p style={{ color: "red" }}>{errorMessage}</p>}
                {showSuccess && <p style={{ color: "green" }}>Successfully logged in</p>}
                <button className={`button login ${buttonIsClicked ? "clicked" : ""}`} type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
