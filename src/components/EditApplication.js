import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AppStateContext from "../AppStateContext";
import DispatchContext from "../DispatchContext";
import { useParams, useNavigate } from "react-router-dom";

export default function EditApplication() {
    const [application, setApplication] = useState(null);
    const [appDescription, setAppDescription] = useState("");
    const [appEndDate, setAppEndDate] = useState("");
    const [appPermitCreate, setAppPermitCreate] = useState("");
    const [appPermitOpen, setAppPermitOpen] = useState("");
    const [appPermitTodo, setAppPermitTodo] = useState("");
    const [appPermitDoing, setAppPermitDoing] = useState("");
    const [appPermitDone, setAppPermitDone] = useState("");
    const [isError, setIsError] = useState(false);
    const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);
    const [userGroupsAvailable, setUserGroupsAvailable] = useState([]);

    const appState = useContext(AppStateContext);
    const appDispatch = useContext(DispatchContext);

    const navigate = useNavigate();

    const { appAcronym } = useParams();

    useEffect(() => {
        let isMounted = true;
        axios
            .post(`http://localhost:8080/application/${appAcronym}`, { verification: { username: appState.username, isEndPoint: false, userGroupsPermitted: [] } }, { withCredentials: true })
            .then((res) => {
                if (isMounted) {
                    const applicationData = res.data;
                    setApplication(applicationData);
                    setAppDescription(applicationData.app_description);
                    setAppEndDate(applicationData.app_enddate);
                    setAppPermitCreate(applicationData.app_permit_create);
                    setAppPermitOpen(applicationData.app_permit_open);
                    setAppPermitTodo(applicationData.app_permit_todo);
                    setAppPermitDoing(applicationData.app_permit_doing);
                    setAppPermitDone(applicationData.app_permit_done);
                }
            })
            .catch((err) => {
                console.log(err);
            });

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
                    console.log(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleAppDescriptionChange = (e) => {
        setAppDescription(e.target.value);
    };

    const handleAppEndDateChange = (e) => {
        setAppEndDate(e.target.value);
    };

    const handleAppPermitCreateChange = (e) => {
        setAppPermitCreate(e.target.value);
    };

    const handleAppPermitOpenChange = (e) => {
        setAppPermitOpen(e.target.value);
    };

    const handleAppPermitTodoChange = (e) => {
        setAppPermitTodo(e.target.value);
    };

    const handleAppPermitDoingChange = (e) => {
        setAppPermitDoing(e.target.value);
    };

    const handleAppPermitDoneChange = (e) => {
        setAppPermitDone(e.target.value);
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            app_description: appDescription,
            app_startdate: application.app_startdate.substring(0, 10),
            app_enddate: appEndDate.substring(0, 10),
            app_permit_create: appPermitCreate,
            app_permit_open: appPermitOpen,
            app_permit_todo: appPermitTodo,
            app_permit_doing: appPermitDoing,
            app_permit_done: appPermitDone,
            verification: {
                username: appState.username,
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };
        console.log(data);

        axios
            .put(`http://localhost:8080/application/${appAcronym}`, data, { withCredentials: true })
            .then(() => {
                setSuccessfullyUpdated(true);
                navigate("/applicationmanagement");
            })
            .catch((err) => {
                console.log(err);
                setIsError(true);
            });
    };

    const handleCancelForm = () => {
        return navigate("/applicationmanagement");
    };

    if (!application) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-form-container">
            <form onSubmit={handleEditFormSubmit}>
                <h1>Edit Application</h1>
                <div className="form-group">
                    <label htmlFor="appAcronym">Application Acronym:</label>
                    <input type="text" id="appAcronym" value={application.app_acronym} readOnly className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="appDescription">Application Description:</label>
                    <textarea id="appDescription" value={appDescription} onChange={handleAppDescriptionChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="appStartDate">Start Date:</label>
                    <input type="date" id="appStartDate" value={application.app_startdate.substring(0, 10)} readOnly className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="appEndDate">End Date:</label>
                    <input type="date" id="appEndDate" value={appEndDate.substring(0, 10)} onChange={handleAppEndDateChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitCreate">Permit Create:</label>
                    <select id="appPermitCreate" value={appPermitCreate} onChange={handleAppPermitCreateChange} className="form-control">
                        <option value="">Select Permit Create</option>
                        {userGroupsAvailable.map((usergroup) => (
                            <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                {usergroup.userGroupName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitOpen">Permit Open:</label>
                    <select id="appPermitOpen" value={appPermitOpen} onChange={handleAppPermitOpenChange} className="form-control">
                        <option value="">Select Permit Open</option>
                        {userGroupsAvailable.map((usergroup) => (
                            <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                {usergroup.userGroupName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitTodo">Permit Todo:</label>
                    <select id="appPermitTodo" value={appPermitTodo} onChange={handleAppPermitTodoChange} className="form-control">
                        <option value="">Select Permit Todo</option>
                        {userGroupsAvailable.map((usergroup) => (
                            <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                {usergroup.userGroupName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitDoing">Permit Doing:</label>
                    <select id="appPermitDoing" value={appPermitDoing} onChange={handleAppPermitDoingChange} className="form-control">
                        <option value="">Select Permit Doing</option>
                        {userGroupsAvailable.map((usergroup) => (
                            <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                {usergroup.userGroupName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitDone">Permit Done:</label>
                    <select id="appPermitDone" value={appPermitDone} onChange={handleAppPermitDoneChange} className="form-control">
                        <option value="">Select Permit Done</option>
                        {userGroupsAvailable.map((usergroup) => (
                            <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                {usergroup.userGroupName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Error message */}
                {isError ? <div className="error-msg">An error occurred while updating the application.</div> : null}

                {/* Success message */}
                {successfullyUpdated ? <div className="success-msg">Application updated successfully.</div> : null}

                <div className="button-group">
                    <button onClick={handleCancelForm} type="button" className="cancel-button">
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
