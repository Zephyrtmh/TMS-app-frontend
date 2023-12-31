import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";
import AppStateContext from "../AppStateContext";
import DispatchStateContext from "../DispatchContext";
// import syncBackend from "../utils/syncBackend";

import Loading from "./Loading";

import "../styles/EditForm.css";
import "../styles/styles.css";

function EditUser() {
    const [userGroupsAvailable, setUserGroupsAvailable] = useState([]);
    const [userDetails, setUserDetails] = useState([]);

    //user form fields
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userAccStatus, setUserAccStatus] = useState("");
    const [userGroupForUser, setUserGroupForUser] = useState([]);
    const [userGroupToChangeTo, setUserGroupToChangeTo] = useState([]);
    const [isError, setIsError] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [successfullyEdit, setSuccessfullyEdit] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const { username } = useParams();

    const appState = useContext(AppStateContext);
    const appDispatch = useContext(DispatchStateContext);

    useEffect(() => {
        let isMounted = true;

        async function syncBackend() {
            //only allow admin users to access
            await axios
                .post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: ["admin"], isEndPoint: true } }, { withCredentials: true })
                .then((verified) => {
                    if (verified.data.verified === false) {
                        setIsLoading(false);
                        return false;
                    } else {
                        setIsLoading(false);
                        return true;
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
                        setSuccessfullyEdit(false);
                    }
                });
        }

        if (syncBackend() === false) {
            navigate("/home");
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        setIsLoading(false);
        let isMounted = true;
        axios
            .post("http://localhost:8080/group/all", { verification: { username: appState.username, isEndPoint: false, userGroupsPermitted: [] } }, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                if (isMounted) {
                    setUserGroupsAvailable(res.data);
                }
            })
            .catch((err) => {
                if (err.response.data.error.statusCode === 401) {
                    appDispatch({ type: "logout" });
                    navigate("/login");
                }
            });

        axios
            .post(`http://localhost:8080/user/${username}`, { verification: { username: appState.username, isEndPoint: false, userGroupsPermitted: [] } }, { withCredentials: true })
            .then((res) => {
                // setUserDetails(res.data);
                setUserEmail(res.data.email);
                setUserAccStatus(res.data.active);
                if (res.data.active === "") {
                    setUserAccStatus("active");
                }
                console.log("userGroups");
                console.log(res.data);
                console.log(res.data.userGroups);
                if (isMounted) {
                    setUserGroupForUser(res.data.userGroups);
                    setUserGroupToChangeTo(res.data.userGroups);
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate("/login");
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCancelButton = () => {
        navigate("/usermanagement");
    };

    const handleEmailChange = (e) => {
        setUserEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setUserPassword(e.target.value);
    };

    const handleAccStatusChange = (e) => {
        setUserAccStatus(e.target.value);
    };

    const handleUserGroupChange = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions).map((option) => option.value);
        console.log(selectedValues);
        setUserGroupToChangeTo(selectedValues);
    };

    const handlePasswordCheckBox = (e) => {
        console.log(!passwordIsChecked);
        setPasswordIsChecked(!passwordIsChecked);
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            password: userPassword,
            email: userEmail,
            active: userAccStatus,
            userGroups: userGroupToChangeTo,
            verification: {
                username: appState.username,
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };
        console.log(data);
        axios
            .put(`http://localhost:8080/user/${username}`, data, { withCredentials: true })
            .then((res) => {
                if (res.data.success) {
                    appDispatch({ type: "edit-user", userGroups: userGroupToChangeTo, active: userAccStatus });
                    //redirect to user management
                    return navigate("/usermanagement");
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
                    setSuccessfullyEdit(false);
                }
            });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="edit-form-container">
            <form onSubmit={handleEditFormSubmit}>
                <h1>Edit User</h1>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" readOnly value={username} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={userEmail} onChange={handleEmailChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input placeholder="Leave blank not changing" type="password" id="password" value={userPassword} onChange={handlePasswordChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Account Status:</label>
                    <select id="status" value={userAccStatus} onChange={handleAccStatusChange} disabled={appState.username === username ? true : false} required className="form-control">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="groups">Groups:</label>
                    {userGroupForUser.length > 0 ? (
                        <div className="user-groups">
                            {userGroupForUser.map((group) => {
                                return (
                                    <div className="user-group" key={group}>
                                        {group}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div>No Groups</div>
                    )}

                    {appState.userGroups.includes("admin") ? (
                        <select id="groups" value={userGroupToChangeTo} onChange={handleUserGroupChange} multiple className="form-control">
                            {userGroupsAvailable.map((userGroup) => (
                                <option key={userGroup.userGroupName} value={userGroup.userGroupName}>
                                    {userGroup.userGroupName}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <></>
                    )}
                </div>
                {/* Error message */}
                {isError ? <div className="error-msg">{errMessage}</div> : <div></div>}
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

export default EditUser;
