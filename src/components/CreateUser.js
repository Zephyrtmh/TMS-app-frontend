import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

import Loading from "./Loading";

import AppStateContext from "../AppStateContext";
import DispatchStateContext from "../DispatchContext";

import "../styles/EditForm.css";

function CreateUser() {
    const [userGroups, setUserGroups] = useState([]);
    const [userDetails, setUserDetails] = useState([]);

    //user form fields
    const [username, setUsername] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userAccStatus, setUserAccStatus] = useState("active");
    const [userGroupToChangeTo, setUserGroupToChangeTo] = useState([]);
    const [userGroupsAvailable, setUserGroupsAvailable] = useState([]);

    const [isError, setIsError] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);

    const appState = useContext(AppStateContext);
    const appDispatch = useContext(DispatchStateContext);

    useEffect(() => {
        let isMounted = true;

        async function syncBackend() {
            //only allow admin users to access
            await axios
                .post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: ["admin"], isEndPoint: true } }, { withCredentials: true })
                .then((verified) => {
                    if (verified) {
                        if (verified.data.verified === false) {
                            setIsLoading(false);
                            return false;
                        } else {
                            setIsLoading(false);
                            return true;
                        }
                    }
                })
                .catch((err) => {
                    if (err.response.data.error.statusCode === 401) {
                        axios.post("http://localhost:8080/logout", {}, { withCredentials: true }).then((res) => {
                            if (res.status === 200) {
                                console.log(res.status);
                                appDispatch({ type: "logout" });
                                return navigate("/login");
                            } else if (res.status !== 200) {
                                return navigate("/login");
                            }
                        });
                        return false;
                    } else {
                        let errorMessage = err.response.data.errorMessage;
                        setErrMessage(errorMessage);
                        setIsError(true);
                        setSuccessfullyCreated(false);
                    }
                });
        }

        if (syncBackend() === false) {
            navigate("/login");
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        axios
            .post("http://localhost:8080/group/all", { verification: { username: appState.username, isEndPoint: false, userGroupsPermitted: [] } }, { withCredentials: true })
            .then((res) => {
                if (isMounted) {
                    setUserGroupsAvailable(res.data);
                }
            })
            .catch((err) => {
                if (err.response.data.error.statusCode === 401) {
                    appDispatch({ type: "logout" });
                    navigate("/login");
                } else {
                    let errorMessage = err.response.data.errorMessage;
                    setErrMessage(errorMessage);
                    setIsError(true);
                    setSuccessfullyCreated(false);
                }
            });
    }, []);

    const handleCancelButton = () => {
        navigate("/usermanagement");
    };

    const handleEmailChange = (e) => {
        setUserEmail(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setUserPassword(e.target.value);
    };

    const handleAccStatusChange = (e) => {
        setUserAccStatus(e.target.value);
    };

    const handleUserGroupChange = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions).map((option) => option.value);
        setUserGroupToChangeTo(selectedValues);
    };

    const handleCreateFormSubmit = (e) => {
        e.preventDefault();

        const data = {
            username: username, // username of user to create
            password: userPassword,
            email: userEmail,
            active: userAccStatus,
            userGroups: userGroupToChangeTo,
            verification: {
                username: appState.username, // current user's username
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };
        console.log(data);

        axios
            .post(`http://localhost:8080/user/create`, data, { withCredentials: true })
            .then((res) => {
                if (res.data.success) {
                    console.log(res.success);
                    //redirect to user management
                    // navigate("/usermanagement");
                    setSuccessfullyCreated(true);
                    clearFields();
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.error.statusCode === 401) {
                    appDispatch({ type: "logout" });
                    navigate("/login");
                } else {
                    let errorMessage = err.response.data.errorMessage;
                    setErrMessage(errorMessage);
                    setIsError(true);
                    setSuccessfullyCreated(false);
                }
            });
    };

    const clearFields = () => {
        setUserGroupToChangeTo("");
        setUserAccStatus("");
        setUserPassword("");
        setUserEmail("");
        setUsername("");
        setIsError(false);
        setErrMessage("");
    };

    const navigate = useNavigate();

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="edit-form-container">
            <form onSubmit={handleCreateFormSubmit}>
                <h1>Create User</h1>
                <div className="form-group">
                    <label htmlFor="username">Username *:</label>
                    <input type="text" id="username" value={username} onChange={handleUsernameChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={userEmail} onChange={handleEmailChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password *:</label>
                    <input type="password" id="password" value={userPassword} onChange={handlePasswordChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Account Status *:</label>
                    <select id="status" value={userAccStatus} onChange={handleAccStatusChange} required className="form-control">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="groups">Groups:</label>

                    <select id="groups" value={userGroupToChangeTo} onChange={handleUserGroupChange} multiple className="form-control">
                        {userGroupsAvailable.map((userGroup) => (
                            <option key={userGroup.userGroupName} value={userGroup.userGroupName}>
                                {userGroup.userGroupName}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Error message */}
                {isError ? <div className="error-msg">{errMessage}</div> : <div></div>}
                {/* success message */}
                {successfullyCreated ? <div className="success-msg">Successfully created User. Create another one.</div> : <div></div>}
                <div className="button-group">
                    <button className="cancel-button" type="button" onClick={handleCancelButton}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateUser;
