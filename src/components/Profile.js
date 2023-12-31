import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";
import AppStateContext from "../AppStateContext";

import Loading from "./Loading";

import "../styles/EditForm.css";
import "../styles/styles.css";
import DispatchContext from "../DispatchContext";

function Profile() {
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

    const [isLoading, setIsLoading] = useState(true);

    const appDispatch = useContext(DispatchContext);
    const appState = useContext(AppStateContext);

    const navigate = useNavigate();

    const { username } = useParams();

    useEffect(() => {
        let isMounted = true;

        async function syncBackend() {
            //only allow admin users to access
            try {
                var verified = await axios.post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: true } }, { withCredentials: true });
                console.log("after sending call to verifyuser: " + verified.verified);
                if (verified.data.verified === false) {
                    setIsLoading(false);
                    return false;
                } else {
                    setIsLoading(false);
                    return true;
                }
            } catch (err) {
                appDispatch({ type: "logout" });
                navigate("/login");
            }
        }

        if (syncBackend() === false) {
            navigate("/home");
        } else {
            console.log("verified");
        }

        console.log("appstate" + appState.username + "other one" + username);
        console.log(appState.username === username);

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        // try {
        //     axios.get("http://localhost:8080/group/all", { verification: { username: appState.username, isEndPoint: false, userGroupsPermitted: [] } }, { withCredentials: true }).then((res) => {
        //         console.log(res.data);
        //         if (isMounted) {
        //             setUserGroupsAvailable(res.data);
        //         }
        //     });
        // } catch (err) {
        //     console.log(err.status);
        // }
        console.log("trying to access: " + username, "as: ", appState.username);
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
                    axios.post("http://localhost:8080/logout", {}, { withCredentials: true }).then((res) => {
                        if (res.status === 200) {
                            console.log(res.status);
                            appDispatch({ type: "logout" });
                            return navigate("/login");
                        } else if (res.status !== 200) {
                            return navigate("/login");
                        }
                    });
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCancelButton = () => {
        navigate("/home");
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
            username: username,
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

        axios
            .put(`http://localhost:8080/user/${username}`, data, { withCredentials: true })
            .then((res) => {
                if (res.data.success) {
                    console.log(res.success);
                    navigate("/home");
                }
            })
            .catch((res) => {
                let errorMessage = res.response.data.errorMessage;
                setErrMessage(errorMessage);
                setIsError(true);
                setUserPassword("");
            });
    };

    return (
        <div className="edit-form-container">
            <form>
                <h1>My Profile</h1>
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

                    {/* {appState.userGroups.includes("admin") ? (
                        <select id="groups" value={userGroupToChangeTo} onChange={handleUserGroupChange} multiple className="form-control">
                            {userGroupsAvailable.map((userGroup) => (
                                <option key={userGroup.userGroupName} value={userGroup.userGroupName}>
                                    {userGroup.userGroupName}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <></>
                    )} */}
                </div>
                {/* Error message */}
                {isError ? <div className="error-msg">{errMessage}</div> : <div></div>}
                <div className="button-group">
                    <button className="cancel-button" type="button" onClick={handleCancelButton}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-button" onClick={handleEditFormSubmit}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Profile;
