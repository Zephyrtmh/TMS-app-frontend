import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AppStateContext from "../AppStateContext";
import DispatchContext from "../DispatchContext";
import { useNavigate } from "react-router-dom";

export default function CreateApplication() {
    const [appAcronym, setAppAcronym] = useState("");
    const [appDescription, setAppDescription] = useState("");
    const [appRNumber, setAppRNumber] = useState("");
    const [appStartDate, setAppStartDate] = useState("");
    const [appEndDate, setAppEndDate] = useState("");
    const [appPermitOpen, setAppPermitOpen] = useState("");
    const [appPermitTodo, setAppPermitTodo] = useState("");
    const [appPermitDoing, setAppPermitDoing] = useState("");
    const [appPermitDone, setAppPermitDone] = useState("");
    const [isError, setIsError] = useState(false);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);
    const [appPermitCreate, setAppPermitCreate] = useState("");
    const [userGroupsAvailable, setUserGroupsAvailable] = useState([]);

    const appState = useContext(AppStateContext);
    const appDispatch = useContext(DispatchContext);

    const navigate = useNavigate();

    const handleAppPermitCreateChange = (e) => {
        setAppPermitCreate(e.target.value);
    };

    const handleAppAcronymChange = (e) => {
        setAppAcronym(e.target.value);
    };

    const handleAppDescriptionChange = (e) => {
        setAppDescription(e.target.value);
    };

    const handleAppRNumberChange = (e) => {
        setAppRNumber(e.target.value);
    };

    const handleAppStartDateChange = (e) => {
        setAppStartDate(e.target.value);
    };

    const handleAppEndDateChange = (e) => {
        setAppEndDate(e.target.value);
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

    const handleCreateFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            app_acronym: appAcronym,
            app_description: appDescription,
            app_Rnumber: appRNumber,
            app_startdate: appStartDate,
            app_enddate: appEndDate,
            app_permit_create: appPermitCreate,
            app_permit_open: appPermitOpen,
            app_permit_todo: appPermitTodo,
            app_permit_doing: appPermitDoing,
            app_permit_done: appPermitDone,
            verification: {
                username: "admin",
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };
        console.log(data);

        axios
            .post("http://localhost:8080/application/create", data, { withCredentials: true })
            .then(() => {
                setSuccessfullyCreated(true);
                //clear fields
                setAppAcronym("");
                setAppDescription("");
                setAppRNumber("");
                setAppStartDate("");
                setAppEndDate("");
                setAppPermitOpen("");
                setAppPermitTodo("");
                setAppPermitDoing("");
                setAppPermitDone("");
                setAppPermitCreate("");
            })
            .catch((err) => {
                console.log(err);
                setIsError(true);
            });
    };

    const handleCancelForm = () => {
        return navigate("/applicationmanagement");
    };

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

    return (
        <div className="edit-form-container">
            <form onSubmit={handleCreateFormSubmit}>
                <h1>Create Application</h1>
                <div className="form-group">
                    <label htmlFor="appAcronym">Application Acronym:</label>
                    <input type="text" id="appAcronym" value={appAcronym} onChange={handleAppAcronymChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="appDescription">Application Description:</label>
                    <textarea id="appDescription" value={appDescription} onChange={handleAppDescriptionChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="appRNumber">Application R Number:</label>
                    <input type="number" id="appRNumber" value={appRNumber} onChange={handleAppRNumberChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="appStartDate">Start Date:</label>
                    <input type="date" id="appStartDate" value={appStartDate} onChange={handleAppStartDateChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="appEndDate">End Date:</label>
                    <input type="date" id="appEndDate" min={appStartDate} value={appEndDate} onChange={handleAppEndDateChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitCreate">Permit Create:</label>
                    <select type="text" id="appPermitCreate" value={appPermitCreate} onChange={handleAppPermitCreateChange} className="form-control">
                        <option value=""></option>
                        {userGroupsAvailable.map((usergroup) => {
                            return (
                                <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                    {usergroup.userGroupName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitOpen">Permit Open:</label>
                    <select type="text" id="appPermitOpen" value={appPermitOpen} onChange={handleAppPermitOpenChange} className="form-control">
                        <option value=""></option>
                        {userGroupsAvailable.map((usergroup) => {
                            return (
                                <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                    {usergroup.userGroupName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitTodo">Permit Todo:</label>
                    <select type="text" id="appPermitTodo" value={appPermitTodo} onChange={handleAppPermitTodoChange} className="form-control">
                        <option value=""></option>
                        {userGroupsAvailable.map((usergroup) => {
                            return (
                                <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                    {usergroup.userGroupName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitDoing">Permit Doing:</label>
                    <select type="text" id="appPermitDoing" value={appPermitDoing} onChange={handleAppPermitDoingChange} className="form-control">
                        <option value=""></option>
                        {userGroupsAvailable.map((usergroup) => {
                            return (
                                <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                    {usergroup.userGroupName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appPermitDone">Permit Done:</label>
                    <select type="text" id="appPermitDone" value={appPermitDone} onChange={handleAppPermitDoneChange} className="form-control">
                        <option value=""></option>\
                        {userGroupsAvailable.map((usergroup) => {
                            return (
                                <option value={usergroup.userGroupName} key={usergroup.userGroupName}>
                                    {usergroup.userGroupName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Error message */}
                {isError ? <div className="error-msg">An error occurred while creating the application.</div> : null}

                {/* Success message */}
                {successfullyCreated ? <div className="success-msg">Application created successfully.</div> : null}

                <div className="button-group">
                    <button type="cancel" onClick={handleCancelForm} className="cancel-button">
                        Cancel
                    </button>
                    <button type="submit" className="submit-button">
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}
