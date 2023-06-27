import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AppStateContext from "../AppStateContext";

function UserManagement() {
    const appState = useContext(AppStateContext);

    const [users, setUsers] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [userGroupToAdd, setUserGroupToAdd] = useState([]);

    useEffect(() => {
        async function syncBackend() {
            var verified = await axios.post("http://localhost:8080/verifyuser", {}, { withCredentials: true });
        }

        syncBackend() === true ? navigate("/login") : navigate("/usermanagement");

        // return navigate("/login");
        //get users
        axios.get("http://localhost:8080/user/all", { withCredentials: true }).then((res) => {
            setUsers(res.data);
        });

        axios.get("http://localhost:8080/group/all", { withCredentials: true }).then((res) => {
            res.data.push({ userGroupName: "" });
            setUserGroups(res.data);
        });
    }, []);

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
            .post("http://localhost:8080/group/create", { userGroup: userGroupToAdd }, { withCredentials: true })
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

    return (
        <>
            {appState.loggedIn && <p>{appState.username + appState.active + appState.userGroup}</p>}
            <div>
                <button className="create-user-button" onClick={handleNavigateToAddUser}>
                    Create User
                </button>
                <div>
                    <ul>
                        {userGroups.map((userGroup) => {
                            if (userGroup.userGroupName !== null && userGroup.userGroupName !== "") {
                                return <li key={userGroup.userGroupName}>{userGroup.userGroupName}</li>;
                            }
                        })}
                    </ul>
                    <form>
                        <label>Group Name</label>
                        <input id="userGroup" value={userGroupToAdd} onChange={handleChangeUserGroupToAdd}></input>
                        <button type="submit" onClick={handleCreateGroup}>
                            Create Group
                        </button>
                    </form>
                </div>
            </div>

            <table>
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
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.active}</td>
                            <td>
                                {user.userGroups.map((userGroup) => {
                                    return <p>{userGroup}</p>;
                                })}
                            </td>
                            <td>
                                <button onClick={() => handleNavigateToEditUser(user)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="additional-content"></div>
        </>
    );
}

export default UserManagement;
