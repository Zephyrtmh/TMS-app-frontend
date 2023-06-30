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

    useEffect(() => {
        async function syncBackend() {
            //only allow admin users to access
            try {
                var verified = await axios.post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: ["admin"], isEndPoint: true } }, { withCredentials: true });
                console.log(verified);
                if (verified.data.verified === false) {
                    setIsLoading(false);
                    return false;
                } else {
                    setIsLoading(false);
                    return true;
                }
            } catch (err) {
                console.log(err);
                navigate("/login");
            }
        }

        if (syncBackend() === false) {
            appDispatch({ type: "logout" });
            navigate("/login");
        }

        // return navigate("/login");
        //get users
        axios.get("http://localhost:8080/user/all", { withCredentials: true }).then((res) => {
            setUsers(res.data);
        });

        axios.get("http://localhost:8080/group/all", { withCredentials: true }).then((res) => {
            res.data.push({ userGroupName: "" });
            setUserGroups(res.data);
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
                console.log("this is the res");
                console.log(res);
                if (res.data) {
                    if (res.data.success === false) {
                        console.log(res.data.reason);
                    } else {
                        const newUserGroups = userGroups.concat({ userGroupName: userGroupToAdd });
                        console.log(newUserGroups);
                        setUserGroups(newUserGroups);
                    }
                }
            })
            .catch((err) => {
                console.log(err.response.data);
                console.log(err.response.status);
            });
        setUserGroupToAdd("");
    };

    const navigate = useNavigate();

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            {appState.loggedIn && <p className="user-info">{appState.username + appState.active + appState.userGroup}</p>}
            <div className="user-section">
                <button className="create-user-button" onClick={handleNavigateToAddUser}>
                    Create User
                </button>
                <div className="user-groups">
                    <ul>
                        {userGroups.map((userGroup) => {
                            if (userGroup.userGroupName !== null && userGroup.userGroupName !== "") {
                                return <li key={userGroup.userGroupName}>{userGroup.userGroupName}</li>;
                            }
                        })}
                    </ul>
                    <form>
                        <label htmlFor="userGroup">Group Name</label>
                        <input id="userGroup" className="user-group-input" value={userGroupToAdd} onChange={handleChangeUserGroupToAdd}></input>
                        <button type="submit" onClick={handleCreateGroup}>
                            Create Group
                        </button>
                    </form>
                </div>
            </div>
            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Active</th>
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
                                    <button className="edit-button" onClick={() => handleNavigateToEditUser(user)}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="additional-content"></div>
        </>
    );
}

export default UserManagement;
