import React, { useState, useContext } from "react";
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

    const appDispatch = useContext(DispatchContext);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Username:", username);
        console.log("Password:", password);
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
                        appDispatch({ type: "login", data: { username: data.username, active: data.active, userGroup: data.userGroup } });
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
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={handleUsernameChange} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                {showError && <p style={{ color: "red" }}>{errorMessage}</p>}
                {showSuccess && <p style={{ color: "green" }}>Successfully logged in</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
