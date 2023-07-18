import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AppStateContext from "../AppStateContext";
import DispatchContext from "../DispatchContext";

import Loading from "./Loading";

// import "../styles/UserManagement.css";
import "../styles/applicationmanagement.css";

function ApplicationManagement() {
    const appState = useContext(AppStateContext);

    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isError, setIsError] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);

    useEffect(() => {
        async function syncBackend() {
            //only allow admin users to access
            setIsLoading(true);

            await axios
                .post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: true } }, { withCredentials: true })
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
                    console.log(err);
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
            .post("http://localhost:8080/application/all", { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: false } }, { withCredentials: true })
            .then((res) => {
                setApplications(res.data);
            })
            .catch((err) => {
                if (err.response.data.error.statusCode === 401) {
                    appDispatch({ type: "logout" });
                    navigate("/login");
                }
            });

        return () => {
            setIsLoading(false);
        };
    }, []);

    const appDispatch = useContext(DispatchContext);

    const handleNavigateToViewApplication = (application) => {
        navigate(`/application/${application.app_acronym}`);
    };

    const handleNavigateToEditApplication = (application) => {
        navigate(`/application/${application.app_acronym}/edit`);
    };

    const handleCreateApplicationNavigate = () => {
        navigate("/application/create");
    };

    const navigate = useNavigate();

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <div className="application-management-container">
                <div className="application-table-container">
                    <div className="create-application-and-task-buttons">
                        {appState.userGroups.includes("project lead") ? (
                            <div className="create-application-button">
                                <button onClick={handleCreateApplicationNavigate}>Create Application</button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <table className="application-table">
                        <thead>
                            <tr>
                                <th>app_acronym</th>
                                <th style={{ maxWidth: "400px", maxHeight: "400px" }}>app_description</th>
                                <th>app_Rnumber</th>
                                <th>app_startdate</th>
                                <th>app_enddate</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application, index) => (
                                <tr key={index}>
                                    <td>{application.app_acronym}</td>
                                    <td>
                                        <div id="application-description">{application.app_description}</div>
                                    </td>
                                    <td>{application.app_Rnumber}</td>
                                    <td>{application.app_startdate.substr(0, 10)}</td>
                                    <td>{application.app_enddate.substr(0, 10)}</td>
                                    <td>
                                        <div className="edit-view-button-container">
                                            <button className="edit-user button" onClick={() => handleNavigateToViewApplication(application)}>
                                                View
                                            </button>
                                            <button className="edit-user button" onClick={() => handleNavigateToEditApplication(application)}>
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ApplicationManagement;
