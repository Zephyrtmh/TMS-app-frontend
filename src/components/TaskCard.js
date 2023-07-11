import "../styles/taskcard.css";
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TaskCard({ task, application, appState, disabled }) {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(task, application);
    }, []);

    const handlePromoteButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=promote`, { state: task });
    };

    const handleEditButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=edit`, { state: task });
    };

    const handleDemoteButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=demote`, { state: task });
    };

    const isPermitted = (action) => {
        const taskState = task.task_state;

        switch (taskState) {
            case "open":
                var permittedUserGroup = application.app_permit_open;
                if (!appState.userGroups.includes(permittedUserGroup)) {
                    return false;
                }
                if (action) {
                    if (action === "promote") {
                        return true;
                    } else if (action === "demote") {
                        return false;
                    } else if (action === "edit") {
                        return true;
                    }
                }
                break;
            case "todo":
                var permittedUserGroup = application.app_permit_todo;
                if (!appState.userGroups.includes(permittedUserGroup)) {
                    return false;
                }
                if (action) {
                    if (action === "promote") {
                        return true;
                    } else if (action === "demote") {
                        return false;
                    } else if (action === "edit") {
                        return true;
                    }
                }
                break;
            case "doing":
                var permittedUserGroup = application.app_permit_doing;
                if (!appState.userGroups.includes(permittedUserGroup)) {
                    return false;
                }
                if (action) {
                    if (action === "promote") {
                        return true;
                    } else if (action === "demote") {
                        return true;
                    } else if (action === "edit") {
                        return true;
                    }
                }
                break;
            case "done":
                var permittedUserGroup = application.app_permit_done;
                if (!appState.userGroups.includes(permittedUserGroup)) {
                    return false;
                }
                if (action) {
                    if (action === "promote") {
                        return true;
                    } else if (action === "demote") {
                        return true;
                    } else if (action === "edit") {
                        return true;
                    }
                }
                break;
            case "closed":
                return false;
            default:
                return false;
        }
    };
    if (disabled || task.task_state === "closed") {
        return (
            <div className="task-card-container">
                {console.log("task", task)}
                {console.log("application", application)}
                <div className="colour-bar" style={{ backgroundColor: task.plan_colour }}>
                    {task.task_plan} {application.app_acronym}
                </div>
                <div className="task-content">
                    <div id="task-id">[ {task.task_id} ]</div>
                    <div id="task-name">{task.task_name}</div>
                    <div id="task-owner">{task.task_owner}</div>
                </div>

                <div id="task-datetime">Created: {task.task_createdate ? task.task_createdate.substring(0, 16) : ""}</div>
                <button style={{ backgroundColor: "grey" }}>Demote</button>

                {/* <Link to={{ pathname:`/task/${task.task_id}`,search: "?type=demote"}} state={task}><button>Demote</button></Link> */}

                <button style={{ backgroundColor: "grey" }}>Edit</button>
                <button style={{ backgroundColor: "grey" }}>Promote</button>
            </div>
        );
    }

    return (
        <div className="task-card-container">
            {console.log("task", task)}
            {console.log("application", application)}
            <div className="colour-bar" style={{ backgroundColor: task.plan_colour }}>
                {task.task_plan} {application.app_acronym}
            </div>
            <div className="task-content">
                <div id="task-id">[ {task.task_id} ]</div>
                <div id="task-name">{task.task_name}</div>
                <div id="task-owner">{task.task_owner}</div>
            </div>

            <div id="task-datetime">Created: {task.task_createdate ? task.task_createdate.substring(0, 16) : ""}</div>
            {task.task_state !== "open" && task.task_state !== "todo" ? (
                <button
                    onClick={() => {
                        if (isPermitted("demote")) {
                            handleDemoteButtonClick(task.task_id);
                        }
                    }}
                >
                    Demote
                </button>
            ) : (
                <button style={{ backgroundColor: "grey" }}>Demote</button>
            )}

            {/* <Link to={{ pathname:`/task/${task.task_id}`,search: "?type=demote"}} state={task}><button>Demote</button></Link> */}

            <button
                onClick={() => {
                    if (isPermitted("edit")) {
                        handleEditButtonClick(task.task_id);
                    }
                }}
            >
                Edit
            </button>
            <button
                onClick={() => {
                    if (isPermitted("promote")) {
                        handlePromoteButtonClick(task.task_id);
                    }
                }}
            >
                Promote
            </button>
        </div>
    );
}
