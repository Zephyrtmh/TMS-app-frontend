import "../styles/taskcard.css";
import "../styles/EditForm.css";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { processStringNotesToArray } from "../utils/NotesUtil";

export default function TaskCard({ task, application, appState, disabled, checkIfSomethingIsExpanded, setSomethingIsExpanded }) {
    const navigate = useNavigate();
    const [taskState, setTaskState] = useState(task.task_state);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        console.log(task);
        // console.log(task, application);
    }, [taskState]);

    const handlePromoteButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=promote`, { state: task });
    };

    const handleEditButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=edit`, { state: task });
    };

    const handleDemoteButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=demote`, { state: task });
    };

    const handleExpand = () => {
        console.log("expanded");
        console.log("checkIfSomethingIsExpanded", checkIfSomethingIsExpanded());
        if (checkIfSomethingIsExpanded() === "" || checkIfSomethingIsExpanded() === task.task_id) {
            setIsExpanded(!isExpanded);
            if (isExpanded) {
                setSomethingIsExpanded("");
            } else {
                setSomethingIsExpanded(task.task_id);
            }
        }
    };

    const isPermitted = (action) => {
        const taskState = task.task_state;
        console.log(task.task_state);
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
                console.log(appState.userGroups);
                console.log(permittedUserGroup);
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
    // if (disabled || task.task_state === "closed") {
    //     return (
    //         <div className="task-card-container-container">
    //             <div className={isExpanded ? "task-card-container-expanded" : "task-card-container"}>
    //                 {/* {console.log("task", task)}
    //             {console.log("application", application)} */}
    //                 {console.log("task_plan: ", task.task_plan)}
    //                 <div className="colour-bar" style={{ backgroundColor: task.plan_colour, display: "flex", justifyContent: "space-between" }}>
    //                     <div>{task.task_plan != "" ? task.task_plan : "No plan"}</div>

    //                     <img src="/images/expand.png" onClick={handleExpand} style={{ width: "12px", height: "12px" }}></img>
    //                 </div>
    //                 <div className="task-content">
    //                     <div id="task-id">[ {task.task_id} ]</div>
    //                     <p id="task-name">{task.task_name}</p>
    //                     <div id="task-owner">{task.task_owner}</div>
    //                 </div>
    //                 {isExpanded ? (
    //                     <div className="form-group">
    //                         <label htmlFor="task_description">Description:</label>
    //                         <input id="task_description" type="text" style={{ width: "80%", height: "200px" }} readyOnly value={task.task_description}></input>
    //                     </div>
    //                 ) : (
    //                     <></>
    //                 )}

    //                 {/* <div id="task-datetime">Created: {task.task_createdate ? task.task_createdate.substring(0, 16) : ""}</div> */}
    //                 <button style={{ backgroundColor: "grey" }}>Demote</button>

    //                 {/* <Link to={{ pathname:`/task/${task.task_id}`,search: "?type=demote"}} state={task}><button>Demote</button></Link> */}

    //                 <button style={{ backgroundColor: "grey" }}>Edit</button>
    //                 <button style={{ backgroundColor: "grey" }}>Promote</button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="task-card-container-container">
            <div className={isExpanded ? "task-card-container-expanded" : "task-card-container"}>
                {/* {console.log("task", task)}
            {console.log("application", application)} */}
                <div className="colour-bar" style={{ backgroundColor: task.plan_colour, display: "flex", justifyContent: "space-between" }}>
                    <div>{task.task_plan ? task.task_plan : "No plan"}</div>
                    <img src="/images/expand.png" onClick={handleExpand} style={{ width: "12px", height: "12px" }}></img>
                </div>
                <div className="task-content">
                    <div id="task-id">[ {task.task_id} ]</div>
                    <div id="task-name">{task.task_name}</div>
                </div>
                <div id="task-owner">Owner: {task.task_owner}</div>
                {isExpanded ? (
                    <div>
                        <div className="form-group">
                            <label htmlFor="task_description">Description:</label>
                            <input id="task_description" type="text" style={{ width: "80%", height: "200px" }} readyOnly value={task.task_description}></input>
                        </div>
                        <div>Comments:</div>
                        <div>
                            {task.task_notes ? (
                                processStringNotesToArray(task.task_notes).map((note) => {
                                    return (
                                        <div key={task.task_id} style={{ borderStyle: "solid" }} className={note.author === "system" ? "system-note" : ""}>
                                            <div className="task-note-top">
                                                <div>{note.author}</div>
                                                <div>{note.createdate}</div>
                                                <div>[{note.state}]</div>
                                            </div>
                                            <div className="task-note-content">{note.content}</div>
                                        </div>
                                    );
                                })
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                <div>
                    {isPermitted("demote") ? (
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

                    {isPermitted("edit") ? (
                        <button
                            onClick={() => {
                                if (isPermitted("edit")) {
                                    handleEditButtonClick(task.task_id);
                                }
                            }}
                        >
                            Edit
                        </button>
                    ) : (
                        <button style={{ backgroundColor: "grey" }}>Edit</button>
                    )}
                    {isPermitted("promote") ? (
                        <button
                            onClick={() => {
                                if (isPermitted("promote")) {
                                    handlePromoteButtonClick(task.task_id);
                                }
                            }}
                        >
                            Promote
                        </button>
                    ) : (
                        <button style={{ backgroundColor: "grey" }}>Promote</button>
                    )}
                </div>
            </div>
        </div>
    );
}
