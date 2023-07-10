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

    useEffect(() => {
        let isMounted = true;

        async function syncBackend() {
            //only allow admin users to access
            await axios
                .post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: ["admin"], isEndPoint: true } }, { withCredentials: true })
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
                        appDispatch({ type: "logout" });
                        navigate("/login");
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
                setPlans(res.data);
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
                console.log(res.data.length);
                res.data.map((task) => {
                    switch (task.task_state) {
                        case "open":
                            setOpenTasks((draft) => {
                                draft.push(task);
                            });
                            break;
                        case "todo":
                            console.log("todo");
                            setTodoTasks((draft) => {
                                draft.push(task);
                            });
                            break;
                        case "doing":
                            console.log("doing");
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

    const navigate = useNavigate();

    const { appAcronym } = useParams();

    const appState = useContext(AppStateContext);
    const appDispatch = useContext(DispatchStateContext);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="application-board-container">
            <div className="application-board-header">
                <h1>Application: {appAcronym}</h1>
                <div className="application-board-header-right">
                    <div>
                        <div>Start date: {application.app_startdate}</div>
                        <div>End date: {application.app_enddate}</div>
                    </div>
                    <select id="groups" onChange={() => {}} multiple className="form-control">
                        <option>All plans</option>
                        {plans.map((plan) => (
                            <option key={plan.plan_mvp_name} value={plan.plan_mvp_name}>
                                {plan.plan_mvp_name}
                            </option>
                        ))}
                    </select>
                    <div>
                        <button>Create Plan</button>
                    </div>
                </div>
            </div>
            <div>
                <table className="application-board-table">
                    <tbody>
                        <tr>
                            <th>Open</th>
                            <th>Todo</th>
                            <th>Doing</th>
                            <th>Done</th>
                            <th>Closed</th>
                        </tr>
                        <tr>
                            <td className="application-board-table-cell">
                                <div className="row-container">
                                    {openTasks.map((task) => {
                                        return <TaskCard key={task.task_id} {...task} />;
                                    })}
                                </div>
                            </td>
                            <td className="application-board-table-cell">
                                <div className="row-container">
                                    {toDoTasks.map((task) => {
                                        return <TaskCard key={task.task_id} {...task} />;
                                    })}
                                </div>
                            </td>
                            <td className="application-board-table-cell">
                                <div className="row-container">
                                    {doingTasks.map((task) => {
                                        return <TaskCard key={task.task_id} {...task} />;
                                    })}
                                </div>
                            </td>
                            <td className="application-board-table-cell">
                                <div className="row-container">
                                    {doneTasks.map((task) => {
                                        return <TaskCard key={task.task_id} {...task} />;
                                    })}
                                </div>
                            </td>
                            <td className="application-board-table-cell">
                                <div className="row-container">
                                    {closedTasks.map((task) => {
                                        return <TaskCard key={task.task_id} {...task} />;
                                    })}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewApplication;
