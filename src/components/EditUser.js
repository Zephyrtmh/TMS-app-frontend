import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

function EditUser() {
    const [userGroups, setUserGroups] = useState([]);
    const [userDetails, setUserDetails] = useState([]);

    //user form fields
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userAccStatus, setUserAccStatus] = useState("");
    const [userGroup, setUserGroup] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/group/all", { withCredentials: true }).then((res) => {
            setUserGroups(res.data);
            console.log(res.data[0].userGroupName);
        });

        axios.post(`http://localhost:8080/user/${username}`, { username: username }, { withCredentials: true }).then((res) => {
            // setUserDetails(res.data);
            setUserEmail(res.data.email);
            setUserAccStatus(res.data.active);
            setUserGroup(res.data.userGroup);
        });
    }, []);

    const handleCancelButton = () => {
        // navigate("/usermanagement");
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
        setUserGroup(e.target.value);
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: userPassword,
            email: userEmail,
            active: userAccStatus,
            userGroup: userGroup,
        };
        console.log(data);

        axios.put(`http://localhost:8080/user/${username}`, data, { withCredentials: true }).then((res) => {
            console.log(res);
            if (res.body.success) {
                console.log("success");
            }
        });
    };

    const navigate = useNavigate();

    const { username } = useParams();

    return (
        <div>
            <form>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" readOnly value={username} />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={userEmail} onChange={handleEmailChange} />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={userPassword} onChange={handlePasswordChange} />
                </div>

                <div>
                    <label htmlFor="status">Account Status:</label>
                    <select id="status" value={userAccStatus} onChange={handleAccStatusChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="groups">Groups:</label>
                    <select id="groups" value={userGroup} onChange={handleUserGroupChange}>
                        {userGroups.map((userGroup, index) => (
                            <option key={index} value={userGroup.userGroupName}>
                                {userGroup.userGroupName}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleCancelButton}>Cancel</button>
                <button type="submit" onClick={handleEditFormSubmit}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EditUser;
