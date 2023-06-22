import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AppStateContext from "../AppStateContext";

function UserManagement() {
    const appState = useContext(AppStateContext);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        //get users
        axios.get("http://localhost:8080/user/all", { withCredentials: true }).then((res) => {
            console.log(res);
            setUsers(res.data);

            console.log(users);
        });
    }, []);

    const handleNavigateToEditUser = (user) => {
        navigate(`/user/${user.username}`);
    };

    const navigate = useNavigate();

    return (
        <>
            {appState.loggedIn && <p>{appState.username + appState.active + appState.userGroup}</p>}
            <button className="create-user-button">Create User</button>
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
                    {users.map((user) => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.active}</td>
                            <td>{user.userGroupName}</td>
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