import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import AppStateContext from "../AppStateContext";
import DispatchStateContext from "../DispatchContext";
import Loading from "./Loading";

export default function CreateTask() {
    const location = useLocation();
    const application = location.state;
    if (!application) {
        return <div>404 Not Found</div>;
    }
    const appAcronym = application ? application.app_acronym : "";
    const appState = useContext(AppStateContext);
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskNotes, setTaskNotes] = useState("");
    const [taskPlan, setTaskPlan] = useState("");
    const [taskAppAcronym, setTaskAppAcronym] = useState(appAcronym);
    const [taskCreator, setTaskCreator] = useState(appState.username);
    const [plans, setPlans] = useState("");

    const [isError, setIsError] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);

    const appDispatch = useContext(DispatchStateContext);

    const handleTaskNameChange = (e) => {
        setTaskName(e.target.value);
    };

    const handleTaskDescriptionChange = (e) => {
        setTaskDescription(e.target.value);
    };

    const handleTaskNotesChange = (e) => {
        setTaskNotes(e.target.value);
    };

    const handleTaskPlanChange = (e) => {
        setTaskPlan(e.target.value);
    };

    const handleTaskAppAcronymChange = (e) => {
        setTaskAppAcronym(e.target.value);
    };

    const handleTaskCreatorChange = (e) => {
        setTaskCreator(e.target.value);
    };

    const handleCancelButton = () => {
        return navigate(`/application/${application.app_acronym}`);
    };

    const handleCreateFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            task_name: taskName,
            task_description: taskDescription,
            task_notes: taskNotes,
            task_plan: taskPlan,
            task_app_acronym: taskAppAcronym,
            task_creator: taskCreator,
            verification: {
                username: appState.username,
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };
        console.log(data);

        axios
            .post("http://localhost:8080/task/create", data, { withCredentials: true })
            .then(() => {
                setTaskName("");
                setTaskDescription("");
                setTaskNotes("");

                setSuccessfullyCreated(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const navigate = useNavigate();

    //verification
    useEffect(() => {
        async function syncBackend() {
            //only allow admin users to access
            await axios
                .post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: [application?.app_permit_create], isEndPoint: true } }, { withCredentials: true })
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
                        return false;
                    } else {
                        let errorMessage = err.response.data.errorMessage;
                        setErrMessage(errorMessage);
                        setIsError(true);
                        setSuccessfullyCreated(false);
                    }
                });
        }

        if (syncBackend() === false) {
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
    }, []);

    useEffect(() => {
        const retrieveData = () => {
            axios
                .post(`http://localhost:8080/plan/all?app=${appAcronym}`, { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: false } }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data);
                    setPlans(res.data);
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        navigate("/login");
                    }
                });
        };
        retrieveData();
    }, []);

    if (isLoading) {
        return <Loading></Loading>;
    }

    return (
        <div className="edit-form-container">
            <form onSubmit={handleCreateFormSubmit}>
                <h1>Create Task</h1>
                <div className="form-group">
                    <label htmlFor="taskName">Task Name:</label>
                    <input type="text" id="taskName" value={taskName} onChange={handleTaskNameChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="taskDescription">Task Description:</label>
                    <textarea id="taskDescription" value={taskDescription} onChange={handleTaskDescriptionChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="taskNotes">Task Notes:</label>
                    <textarea id="taskNotes" value={taskNotes} onChange={handleTaskNotesChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="taskPlan">Task Plan:</label>
                    <select type="text" id="taskPlan" value={taskPlan} onChange={handleTaskPlanChange} className="form-control">
                        <option value=""></option>
                        {plans
                            ? plans.map((plan) => {
                                  return (
                                      <option value={plan.plan_mvp_name} key={plan.plan_mvp_name}>
                                          {plan.plan_mvp_name} ({plan.plan_startdate.substring(0, 10)} - {plan.plan_enddate.substring(0, 10)})
                                      </option>
                                  );
                              })
                            : ""}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="taskAppAcronym">Task Application Acronym:</label>
                    <input type="text" id="taskAppAcronym" readOnly value={taskAppAcronym} onChange={handleTaskAppAcronymChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="taskCreator">Task Creator:</label>
                    <input type="text" id="taskCreator" readOnly value={taskCreator} onChange={handleTaskCreatorChange} className="form-control" required />
                </div>
                {/* Error message */}
                {isError ? <div className="error-msg">{errMessage}</div> : <div></div>}
                {/* success message */}
                {successfullyCreated ? <div className="success-msg">Successfully created Plan. Create another one.</div> : <div></div>}

                <div className="button-group">
                    <button className="cancel-button" onClick={handleCancelButton}>
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
