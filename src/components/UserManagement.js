import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AppStateContext from "../AppStateContext";
import DispatchContext from "../DispatchContext";

import Loading from "./Loading";

import "../styles/UserManagement.css";

function UserManagement() {
    const appState = useContext(AppStateContext);

    const [users, setUsers] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [userGroupToAdd, setUserGroupToAdd] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isError, setIsError] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);

    useEffect(() => {
        async function syncBackend() {
            //only allow admin users to access
            setIsLoading(true);

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
                    "";
                    if (err.response.data.error.statusCode === 401) {
                        appDispatch({ type: "logout" });
                        navigate("/login");
                        return;
                    } else {
                        let errorMessage = err.response.data.errorMessage;
                        setErrMessage(errorMessage);
                        setIsError(true);
                        setSuccessfullyCreated(false);
                    }
                });
        }

        if (syncBackend() === false) {
            appDispatch({ type: "logout" });
            navigate("/login");
            return;
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        axios
            .post("http://localhost:8080/user/all", { verification: { username: appState.username, userGroupsPermitted: ["admin"], isEndPoint: false } }, { withCredentials: true })
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                if (err.response.data.error.statusCode === 401) {
                    appDispatch({ type: "logout" });
                    navigate("/login");
                }
            });

        axios
            .post("http://localhost:8080/group/all", { verification: { username: appState.username, isEndPoint: false, userGroupsPermitted: ["admin"] } }, { withCredentials: true })
            .then((res) => {
                res.data.push({ userGroupName: "" });
                setUserGroups(res.data);
            })
            .catch((err) => {
                if (err.response.data.error.statusCode === 401) {
                    appDispatch({ type: "logout" });
                    navigate("/login");
                    return;
                } else {
                    let errorMessage = err.response.data.errorMessage;
                    setErrMessage(errorMessage);
                    setIsError(true);
                    setSuccessfullyCreated(false);
                }
            });

        return () => {
            setIsLoading(false);
        };
    }, []);

    const appDispatch = useContext(DispatchContext);

    const handleNavigateToEditUser = (user) => {
        navigate(`/user/${user.username}`);
    };

    const handleNavigateToAddUser = () => {
        navigate(`/user/create`);
    };

    const handleChangeUserGroupToAdd = (e) => {
        setUserGroupToAdd(e.target.value);
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:8080/group/create", { userGroup: userGroupToAdd, verification: { username: appState.username, isEndPoint: false, userGroupsPermitted: ["admin"] } }, { withCredentials: true })
            .then((res) => {
                if (res.data) {
                    if (res.data.success === false) {
                    } else {
                        setSuccessfullyCreated(true);
                        setIsError(false);
                        const newUserGroups = userGroups.concat({ userGroupName: userGroupToAdd });

                        setUserGroups(newUserGroups);
                    }
                }
            })
            .catch((err) => {
                "";
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
        setUserGroupToAdd("");
    };

    const navigate = useNavigate();

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <div className="user-section-container">
                <div className="user-section">
                    <button className="create-user button" onClick={handleNavigateToAddUser}>
                        Create User
                    </button>
                    <div className="user-groups-usermanagement">
                        <div>
                            <div>user-group list</div>
                            <div className="existing-user-groups-list">
                                <ul>
                                    {userGroups.map((userGroup) => {
                                        if (userGroup.userGroupName !== null && userGroup.userGroupName !== "") {
                                            return <li key={userGroup.userGroupName}>{userGroup.userGroupName}</li>;
                                        }
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <form className="create-group-form">
                                <div className="create-group-form-input">
                                    <label htmlFor="userGroup">Group Name</label>
                                    <input id="userGroup" className="user-group-input" value={userGroupToAdd} onChange={handleChangeUserGroupToAdd}></input>
                                </div>

                                <button type="submit" onClick={handleCreateGroup} className="create-group button">
                                    Create Group
                                </button>
                            </form>
                            {/* Error message */}
                            {isError ? <div className="error-msg">{errMessage}</div> : <div></div>}
                            {/* success message */}
                            {successfullyCreated ? <div className="success-msg">Successfully created group. Create another one.</div> : <div></div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>User Group</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.username}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.active}</td>
                                <td>
                                    {user.userGroups.length !== 0 ? (
                                        <div className="table-user-groups-container">
                                            {user.userGroups.map((userGroup) => {
                                                return (
                                                    <div className="table-user-group" key={userGroup}>
                                                        {userGroup}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p></p>
                                    )}
                                </td>
                                <td>
                                    <button className="edit-user button" onClick={() => handleNavigateToEditUser(user)}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default UserManagement;
