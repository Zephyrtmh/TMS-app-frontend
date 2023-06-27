import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";
import AppStateContext from "../AppStateContext";

function EditUser(prop) {
    const [userGroupsAvailable, setUserGroupsAvailable] = useState([]);
    const [userDetails, setUserDetails] = useState([]);

    //user form fields
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userAccStatus, setUserAccStatus] = useState("");
    const [userGroupForUser, setUserGroupForUser] = useState([]);
    const [passwordIsChecked, setPasswordIsChecked] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/group/all", { withCredentials: true }).then((res) => {
            console.log(res.data);
            res.data.push({ userGroupName: "" });
            setUserGroupsAvailable(res.data);
        });

        axios
            .post(`http://localhost:8080/user/${username}`, { username: username }, { withCredentials: true })
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
                setUserGroupForUser(res.data.userGroups);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate("/login");
                }
            });
        console.log("appstate" + appState.username + "other one" + username);
        console.log(appState.username === username);
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
        setUserGroupForUser(e.target.value);
    };

    const handlePasswordCheckBox = (e) => {
        console.log(!passwordIsChecked);
        setPasswordIsChecked(!passwordIsChecked);
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: userPassword,
            changePassword: passwordIsChecked,
            email: userEmail,
            active: userAccStatus,
            userGroup: userGroup,
        };

        axios
            .put(`http://localhost:8080/user/${username}`, data, { withCredentials: true })
            .then((res) => {
                if (res.data.success) {
                    console.log(res.success);
                    //redirect to user management
                    navigate("/usermanagement");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const navigate = useNavigate();

    const { username } = useParams();

    const appState = useContext(AppStateContext);

    return (
        <div>
            <form>
                <h1>Edit User</h1>
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
                    <input type="password" id="password" value={userPassword} readOnly={!passwordIsChecked} onChange={handlePasswordChange} />
                    <input type="checkbox" checked={passwordIsChecked} onChange={handlePasswordCheckBox} />
                    <div>Change password</div>
                </div>

                <div>
                    <label htmlFor="status">Account Status:</label>
                    <select id="status" value={userAccStatus} onChange={handleAccStatusChange} disabled={appState.username === username ? true : false} required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="groups">Groups:</label>
                    <div>
                        {userGroupForUser.map((group, index) => {
                            return <p key={index}>{group}</p>;
                        })}
                    </div>
                    <select id="groups" value={userGroupsAvailable} onChange={handleUserGroupChange}>
                        {userGroupsAvailable.map((userGroup, index) => (
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
