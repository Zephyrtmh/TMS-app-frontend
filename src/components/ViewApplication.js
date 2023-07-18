import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";
import AppStateContext from "../AppStateContext";
import DispatchStateContext from "../DispatchContext";
import { useImmer } from "use-immer";
// import syncBackend from "../utils/syncBackend";

import Loading from "./Loading";

import "../styles/EditForm.css";
import "../styles/styles.css";
import "../styles/applicationboard.css";
import TaskCard from "./TaskCard";

function ViewApplication() {
    const [userGroupsAvailable, setUserGroupsAvailable] = useState([]);
    const [userDetails, setUserDetails] = useState([]);

    //user form fields
    const [application, setApplication] = useState({});
    const [plans, setPlans] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [openTasks, setOpenTasks] = useImmer([]);
    const [toDoTasks, setTodoTasks] = useImmer([]);
    const [doingTasks, setDoingTasks] = useImmer([]);
    const [doneTasks, setDoneTasks] = useImmer([]);
    const [closedTasks, setClosedTasks] = useImmer([]);

    const [isLoading, setIsLoading] = useState(true);

    const [selectedPlans, setSelectedPlans] = useState([]);
    const [somethingIsExpanded, setSomethingIsExpanded] = useState("");

    const navigate = useNavigate();

    const { appAcronym } = useParams();

    const appState = useContext(AppStateContext);
    const appDispatch = useContext(DispatchStateContext);

    const permitCreate = appState.userGroups.includes(application.app_permit_create);
    const permitOpen = appState.userGroups.includes(application.app_permit_open);
    const permitTodo = appState.userGroups.includes(application.app_permit_todo);
    const permitDoing = appState.userGroups.includes(application.app_permit_doing);
    const permitDone = appState.userGroups.includes(application.app_permit_done);
    const permitClosed = appState.userGroups.includes(application.app_permit_closed);

    const handleCreatePlan = () => {
        navigate("/plan/create", { state: application });
    };

    const handleCreateTaskNavigate = () => {
        navigate("/task/create", { state: application });
    };

    const checkIfSomethingIsExpanded = () => {
        return somethingIsExpanded;
    };

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        async function syncBackend() {
            //only allow admin users to access
            await axios
                .post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: true } }, { withCredentials: true })
                .then((verified) => {
                    if (verified.data.verified === false) {
                        setIsLoading(false);
                        return false;
                    } else {
                        setIsLoading(false);
                        return true;
                    }
                })
                .catch((err) => {
                    if (err.response.data.error.statusCode === 401) {
                        axios.post("http://localhost:8080/logout", {}, { withCredentials: true }).then((res) => {
                            if (res.status === 200) {
                                console.log(res.status);
                                appDispatch({ type: "logout" });
                                return navigate("/login");
                            } else if (res.status !== 200) {
                                return navigate("/login");
                            }
                        });
                    } else {
                        let errorMessage = err.response.data.errorMessage;
                        setErrMessage(errorMessage);
                        setIsError(true);
                        setSuccessfullyEdit(false);
                    }
                });
        }

        if (syncBackend() === false) {
            navigate("/home");
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        setIsLoading(false);
        let isMounted = true;

        axios
            .post(`http://localhost:8080/application/${appAcronym}`, { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: false } }, { withCredentials: true })
            .then((res) => {
                setApplication(res.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate("/login");
                }
            });

        axios
            .post(`http://localhost:8080/plan/all?app=${appAcronym}`, { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: false } }, { withCredentials: true })
            .then((res) => {
                const convertedData = res.data.reduce((obj, item, index) => {
                    obj[item.plan_mvp_name] = item;
                    return obj;
                }, {});
                setPlans(convertedData);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate("/login");
                }
            });

        axios
            .post(`http://localhost:8080/task/all?app=${appAcronym}`, { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: false } }, { withCredentials: true })
            .then((res) => {
                setTasks(res.data);
                res.data.map((task) => {
                    switch (task.task_state) {
                        case "open":
                            setOpenTasks((draft) => {
                                draft.push(task);
                            });
                            break;
                        case "todo":
                            setTodoTasks((draft) => {
                                draft.push(task);
                            });
                            break;
                        case "doing":
                            setDoingTasks((draft) => {
                                draft.push(task);
                            });
                            break;
                        case "done":
                            setDoneTasks((draft) => {
                                draft.push(task);
                            });
                            break;
                        case "closed":
                            setClosedTasks((draft) => {
                                draft.push(task);
                            });
                            break;
                        default:
                            console.log("belongs in none of the states");
                    }
                });
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                if (err.statusCode === 401) {
                    navigate("/login");
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        console.log(selectedPlans);
        for (let plan of selectedPlans) {
            console.log(plans[plan]);
        }
    }, [selectedPlans]);

    const handleSelectPlan = (e) => {
        var plans = Array.from(e.target.selectedOptions).map((option) => option.value);
        setSelectedPlans(plans);
        // setTimeout(() => {

        // }, 2000);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="application-board-container">
            <div className="application-board-header">
                <div>
                    <h1>Application: {appAcronym}</h1>
                    <div>
                        <div>Start date: {application.app_startdate ? application.app_startdate.substring(0, 10) : ""}</div>
                        <div>End date: {application.app_enddate ? application.app_enddate.substring(0, 10) : ""}</div>
                    </div>
                </div>
                <div className="application-board-header-right">
                    {selectedPlans.length > 0 ? (
                        <div className="plan-detail-container">
                            {selectedPlans.map((plan) => {
                                let plan_ = plans[plan];
                                return (
                                    <div className="plan-detail-cell" key={plan_.plan_mvp_name}>
                                        <div id="plan-name">{plan_.plan_mvp_name}</div>
                                        <div>
                                            &nbsp;&nbsp;[{plan_.plan_startdate.substring(0, 10)} -&gt; {plan_.plan_enddate.substring(0, 10)}]
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="plan-detail-container"></div>
                    )}
                    <select id="groups" onChange={handleSelectPlan} multiple className="form-control plan-list">
                        {/* <option>All plans</option> */}
                        {Object.values(plans).map((plan) => (
                            <option key={plan.plan_mvp_name} value={plan.plan_mvp_name} style={{ backgroundColor: plan.plan_colour ? plan.plan_colour : "white" }}>
                                {plan.plan_mvp_name}
                            </option>
                        ))}
                    </select>

                    <div>
                        {appState.userGroups.includes(application.app_permit_create) ? (
                            <div className="create-task-button">
                                <button onClick={handleCreateTaskNavigate}>Create Task</button>
                            </div>
                        ) : (
                            <></>
                        )}
                        {appState.userGroups.includes(application.app_permit_open) ? (
                            <div>
                                <button onClick={handleCreatePlan}>Create Plan</button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <table className="application-board-table">
                    <tbody>
                        <tr>
                            <th>
                                <h2 className="application-board-column-header">OPEN</h2>
                            </th>
                            <th>
                                <h2 className="application-board-column-header">TODO</h2>
                            </th>
                            <th>
                                <h2 className="application-board-column-header">DOING</h2>
                            </th>
                            <th>
                                <h2 className="application-board-column-header">DONE</h2>
                            </th>
                            <th>
                                <h2 className="application-board-column-header">CLOSED</h2>
                            </th>
                        </tr>
                        <tr>
                            {/* Open state */}

                            {application ? (
                                permitOpen ? (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {openTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={false} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                ) : (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {openTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={true} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                )
                            ) : (
                                <></>
                            )}
                            {/* todo tate */}
                            {application ? (
                                permitTodo ? (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {toDoTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={false} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                ) : (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {toDoTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={true} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                )
                            ) : (
                                <></>
                            )}
                            {/* doing state */}
                            {application ? (
                                permitDoing ? (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {doingTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={false} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                ) : (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {doingTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={true} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                )
                            ) : (
                                <></>
                            )}

                            {/* done state */}
                            {application ? (
                                permitDone ? (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {doneTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={false} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                ) : (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {doneTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={true} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                )
                            ) : (
                                <></>
                            )}

                            {/* closed state */}
                            {application ? (
                                permitDone ? (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {closedTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={false} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                ) : (
                                    <td className="application-board-table-cell">
                                        <div className="row-container">
                                            {closedTasks.map((task) => {
                                                return <TaskCard key={task.task_id} task={task} application={application} appState={appState} disabled={true} checkIfSomethingIsExpanded={checkIfSomethingIsExpanded} setSomethingIsExpanded={setSomethingIsExpanded} />;
                                            })}
                                        </div>
                                    </td>
                                )
                            ) : (
                                <></>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewApplication;
