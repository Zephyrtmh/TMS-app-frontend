import "../styles/taskcard.css";
import "../styles/EditForm.css";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { processStringNotesToArray } from "../utils/NotesUtil";

export default function TaskCard({ task, application, appState, disabled, checkIfSomethingIsExpanded, setSomethingIsExpanded }) {
    const navigate = useNavigate();
    const [taskState, setTaskState] = useState(task.task_state);
    const [isExpanded, setIsExpanded] = useState(false);
    const [notes, setNotes] = useState([]);
    const [notesToDisplay, setNotesToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(0);
    const [mouseXPer, setMouseXPer] = useState(0);
    const [mouseYPer, setMouseYPer] = useState(0);

    // useEffect(() => {
    //     var notesArray = processStringNotesToArray(task.task_notes);
    //     console.log("task.task_notes", task.task_notes);
    //     setNotes(notesArray);

    //     const itemsPerPage = 5;
    //     const totalPages = notesArray.length % itemsPerPage === 0 ? Math.trunc(notesArray.length / itemsPerPage) : Math.trunc(notesArray.length / itemsPerPage) + 1;
    //     var pages = [];
    //     for (let i = 0; i < totalPages; i++) {
    //         pages.push(i + 1);
    //     }
    //     setPagination(pages);

    //     // const startIndex = (currentPage - 1) * itemsPerPage;
    //     // const endIndex = startIndex + itemsPerPage;
    //     const startIndex = Math.max(0, notesArray.length - currentPage * itemsPerPage);
    //     console.log("itemsPerPage", itemsPerPage);
    //     console.log("currentPage", currentPage);
    //     console.log("startIndex", startIndex);
    //     const endIndex = Math.max(0, notesArray.length - (currentPage - 1) * itemsPerPage);
    //     console.log("endIndex", endIndex);

    //     setNotesToDisplay(notesArray.slice(startIndex, endIndex));
    //     console.log("notesArray.slice(startIndex, endIndex)", notesArray.slice(startIndex, endIndex));
    // }, []);

    useEffect(() => {
        var notesArray = processStringNotesToArray(task.task_notes);
        setNotes(notesArray);

        const itemsPerPage = 5;
        const totalPages = notesArray.length % itemsPerPage === 0 ? Math.trunc(notesArray.length / itemsPerPage) : Math.trunc(notesArray.length / itemsPerPage) + 1;
        var pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(i + 1);
        }
        setPagination(pages);

        // const startIndex = (currentPage - 1) * itemsPerPage;
        // const endIndex = startIndex + itemsPerPage;
        const startIndex = Math.max(0, notesArray.length - currentPage * itemsPerPage);
        const endIndex = Math.max(0, notesArray.length - (currentPage - 1) * itemsPerPage);
        setNotesToDisplay(notesArray.slice(startIndex, endIndex));
    }, [currentPage]);

    const handlePromoteButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=promote`, { state: task });
    };

    const handleEditButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=edit`, { state: task });
    };

    const handleDemoteButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=demote`, { state: task });
    };

    const handlePageChange = (number) => {
        setCurrentPage(number);
    };

    const handleExpand = (event) => {
        console.log("expanded");
        console.log("checkIfSomethingIsExpanded", checkIfSomethingIsExpanded());
        if (checkIfSomethingIsExpanded() === "" || checkIfSomethingIsExpanded() === task.task_id) {
            setIsExpanded(!isExpanded);
            if (isExpanded) {
                setSomethingIsExpanded("");
            } else {
                setSomethingIsExpanded(task.task_id);
                setMouseXPer((event.clientX / window.innerWidth) * 100);
                setMouseYPer((event.clientY / window.innerHeight) * 100);
            }
        }
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
            <div className={isExpanded ? (mouseXPer > 50 ? "task-card-container-expanded-left" : "task-card-container-expanded-right") : "task-card-container"}>
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
                    <div className="expanded-task-container">
                        {console.log("notesToDisplay", notesToDisplay)}
                        <div htmlFor="task-description" className="details-header">
                            Description:
                        </div>
                        <div id="task-description" type="text" style={{ width: "90%", maxHeight: "200px", textAlign: "left", verticalAlign: "top" }}>
                            {task.task_description}
                        </div>

                        <div className="details-header">Comments:</div>
                        <div className="notes-container">
                            {task.task_notes ? (
                                notesToDisplay.map((note) => {
                                    return (
                                        <div key={task.task_id} className={note.author === "system" ? "system-note" : ""}>
                                            <div className="task-note-top">
                                                <div className="task-note-top-content" id="note-author">
                                                    {note.author}
                                                </div>
                                                <div className="task-note-top-content" id="note-state">
                                                    [ {note.state} ]
                                                </div>
                                                <div className="task-note-top-content" id="note-datetime">
                                                    {note.createdate}
                                                </div>
                                            </div>
                                            <div className="task-note-content">{note.content}</div>
                                        </div>
                                    );
                                })
                            ) : (
                                <>No Notes</>
                            )}
                        </div>
                        <div className="pagination-container">
                            {pagination.map((number) => {
                                return (
                                    <p
                                        onClick={() => {
                                            handlePageChange(number);
                                        }}
                                        className={currentPage === number ? "page-number current-page" : "page-number"}
                                        key={number}
                                    >
                                        {number}
                                    </p>
                                );
                            })}
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
