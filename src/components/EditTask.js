import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import AppStateContext from "../AppStateContext";
import DispatchStateContext from "../DispatchContext";

// import deleteButton from "../../public/images/delete-button.png";

import "../styles/EditForm.css";
import { addNote, processStringNotesToArray } from "../utils/NotesUtil";
import Loading from "./Loading";

export default function EditTask() {
    const { taskId } = useParams();
    const location = useLocation();
    const taskDetails = location.state;

    // const searchParams = new URLSearchParams(location.search);
    // const type = searchParams.get('type');

    const appState = useContext(AppStateContext);
    const appDispatch = useContext(DispatchStateContext);

    const [task, setTask] = useState({});
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [action, setAction] = useState(new URLSearchParams(location.search).get("type"));
    const [permission, setPermission] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [noteInput, setNoteInput] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [application, setApplication] = useState({});
    const [buttonString, setButtonString] = useState("");
    const [headerString, setHeaderString] = useState("");

    const [taskNotes, setTaskNotes] = useState("");

    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    var taskGlobal;

    const getButtonString = (taskData) => {
        var taskState = taskData.task_state;
        if (action === "demote") {
            switch (taskState) {
                case "doing":
                    return "Return";
                case "done":
                    return "Reject";
                default:
                    return "Submit";
            }
        } else if (action === "promote") {
            switch (taskState) {
                case "open":
                    return "Release";
                case "todo":
                    return "Promote";
                case "doing":
                    return "Promote";
                case "done":
                    return "Approve";
                default:
                    return "Submit";
            }
        } else if (action === "edit") {
            return "Submit";
        }
    };

    const getHeaderString = (taskData) => {
        var taskState = taskData.task_state;

        if (action === "demote") {
            switch (taskState) {
                case "doing":
                    return "Return";
                case "done":
                    return "Reject";
                default:
                    return "Submit";
            }
        } else if (action === "promote") {
            return getButtonString(taskData);
        } else if (action === "edit") {
            console.log("action is edit");
            return "Edit";
        } else {
            return "huh";
        }
    };

    const retrieveTask = async () => {
        try {
            var task_ = await axios.post(`http://localhost:8080/task/${taskId}`, { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: false } }, { withCredentials: true });
            taskGlobal = task_;
            var application = await axios.post(`http://localhost:8080/application/${task_.data.task_app_acronym}`, { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: false } }, { withCredentials: true });
            setApplication(application);
            var plans = await axios.post(`http://localhost:8080/plan/all?app=${task_.data.task_app_acronym}`, { verification: { username: appState.username, userGroupsPermitted: [], isEndPoint: false } }, { withCredentials: true });
            setPlans(plans.data);
            setTask(task_.data);
            console.log(task_.data);
            setHeaderString(getHeaderString(task_.data));
            console.log("getHeaderString(task__.data)", getHeaderString(task_.data));
            setButtonString(getButtonString(task_.data));
            console.log("getButtonString(task_.data)", getButtonString(task_.data));
            var notes = processStringNotesToArray(task_.data.task_notes);
            setTaskNotes(notes);
            console.log("something 4");
            setSelectedPlan(task_.data.task_plan);
            console.log("task_.data", task_.data);

            switch (task_.data.task_state) {
                case "open":
                    setPermission(application.data.app_permit_open);
                    return application.data.app_permit_open;
                case "todo":
                    setPermission(application.data.app_permit_todo);
                    return application.data.app_permit_todo;
                case "doing":
                    setPermission(application.data.app_permit_doing);
                    return application.data.app_permit_doing;
                case "done":
                    setPermission(application.data.app_permit_done);
                    return application.data.app_permit_done;
                case "closed":
                    setPermission("admin");
                    return "admin";
                default:
                    console.log("task not in any state");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleCancelButton = () => {
        return navigate(`/application/${task.task_app_acronym}`);
    };

    const handleSubmitButton = (e) => {
        console.log("button pressed");
        e.preventDefault();
        const data = {
            task_name: task.task_name,
            task_description: task.task_description,
            task_notes: newNote,
            task_plan: selectedPlan,
            task_state: task.task_state,
            task_creator: task.task_creator,
            task_owner: appState.username,
            task_createdate: task.task_createdate,
            oldTask: task,
            verification: {
                username: appState.username,
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };
        const actionData = {
            taskId: task.task_id,
            username: appState.username,
            action: action,
            oldTask: task,
            verification: {
                username: appState.username,
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };

        try {
            axios
                .put(`http://localhost:8080/task/${task.task_id}`, data, { withCredentials: true })
                .then((res) => {
                    switch (action) {
                        case "promote":
                            axios
                                .post("http://localhost:8080/task/promote", actionData, { withCredentials: true })
                                .then((res) => {
                                    console.log(res.data);
                                    return navigate(`/application/${task.task_app_acronym}`);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return navigate(`/application/${task.task_app_acronym}`);
                                });
                            break;
                        case "demote":
                            axios
                                .post("http://localhost:8080/task/demote", actionData, { withCredentials: true })
                                .then((res) => {
                                    console.log(res.data);
                                    return navigate(`/application/${task.task_app_acronym}`);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return navigate(`/application/${task.task_app_acronym}`);
                                });
                            break;
                        case "edit":
                            navigate(`/application/${task.task_app_acronym}`);
                            break;
                        default:
                            console.log("no action provided");
                            break;
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSelectedPlan = (e) => {
        setSelectedPlan(e.target.value);
    };

    const handleNoteOnChange = (e) => {
        setNewNote(e.target.value);
    };

    const addNoteInput = () => {
        setNoteInput(!noteInput);
    };

    const handlePageChange = (number) => {
        setCurrentPage(number);
    };

    //verify user permission
    useEffect(() => {
        console.log("user verified 1");
        async function syncBackend() {
            //only allow users to access
            var applicationPermission = await retrieveTask();
            axios
                .post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: [applicationPermission], isEndPoint: true } }, { withCredentials: true })
                .then((verified) => {
                    if (verified.data.verified === false) {
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
                        // var notes = processStringNotesToArray(task.task_notes);
                        // setTaskNotes(notes);
                        // setHeaderString(geHeaderString());
                        // setButtonString(getButtonString());

                        setIsLoading(false);
                        console.log("user verified 2");
                        return true;
                    }
                })
                .catch((err) => {
                    console.log(err);
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
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [notes, setNotes] = useState([]);
    const [pagination, setPagination] = useState(0);
    const [notesToDisplay, setNotesToDisplay] = useState([]);
    useEffect(() => {
        var notesArray = processStringNotesToArray(task.task_notes);
        console.log("task", task);
        setNotes(notesArray);

        const itemsPerPage = 5;
        const totalPages = notesArray.length % itemsPerPage === 0 ? Math.trunc(notesArray.length / itemsPerPage) : Math.trunc(notesArray.length / itemsPerPage) + 1;
        var pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(i + 1);
        }
        setPagination(pages);

        const startIndex = Math.max(0, notesArray.length - currentPage * itemsPerPage);
        const endIndex = Math.max(0, notesArray.length - (currentPage - 1) * itemsPerPage);
        setNotesToDisplay(notesArray.slice(startIndex, endIndex));
    }, [currentPage, task]);

    // useEffect(() => {
    //     var notesArray = processStringNotesToArray(task.task_notes);
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
    //     const endIndex = Math.max(0, notesArray.length - (currentPage - 1) * itemsPerPage);
    //     setNotesToDisplay(notesArray.slice(startIndex, endIndex));
    // }, [currentPage]);

    // useEffect(() => {
    //     console.log("user verified 3");
    //     var notes = processStringNotesToArray(task.task_notes);
    //     setTaskNotes(notes);
    //     setHeaderString(geHeaderString());
    //     setButtonString(getButtonString());
    //     console.log(isLoading);
    // }, [task]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="edit-task-for-container">
            <form>
                <h1>{headerString} Task</h1>
                <div className="task-details">
                    <div>Task ID: {task.task_id}</div>
                    <div>Task Creator: {task.task_creator}</div>
                    <div>Task Owner: {task.task_owner}</div>
                    <div>Task Create Date: {task.task_createdate ? task.task_createdate.substr(0, 10) : task.task_createdate}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="taskname">Task Name:</label>
                    <input type="text" id="taskname" readOnly value={task.task_name} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <input type="email" id="description" readOnly value={task.task_description} onChange={() => {}} className="form-control" />
                </div>

                <div>
                    <label htmlFor="plans">Plan:</label>
                    {(task.task_state === "open" || task.task_state === "done") && action === "demote" ? (
                        <select id="plans" value={selectedPlan} onChange={handleSelectedPlan} className="form-control" disabled={(appState.userGroups.includes(application.app_permit_open) && task.task_state === "open") || (appState.userGroups.includes(application.app_permit_done) && task.task_state === "done")}>
                            <option value=""></option>
                            {plans.map((plan) => (
                                <option key={plan.plan_mvp_name} value={plan.plan_mvp_name}>
                                    {plan.plan_mvp_name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input type="text" readOnly className="form-control" value={task.task_plan}></input>
                    )}
                </div>
                <div>
                    {/* <table>
                        <thead>
                            <tr>
                                <th>Content</th>
                                <th>state</th>
                                <th>Author</th>
                                <th>Create Datetime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskNotes ? (
                                taskNotes.map((note, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{note.content ? note.content : "blank"}</td>
                                            <td>{note.state}</td>
                                            <td>{note.author ? note.author : "blank"}</td>
                                            <td>{note.createdate}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <></>
                            )}
                        </tbody>
                    </table> */}
                    <div className="details-header">Comments:</div>
                    <div className="notes-container">
                        {console.log("tasknotes", notesToDisplay)}
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
                    {noteInput == false ? <button onClick={addNoteInput}>Add Note</button> : <></>}
                    <div style={{ display: "flex" }}>
                        {noteInput == true ? <img src="/images/deletebutton.jpg" alt="Button Image" onClick={addNoteInput} style={{ width: "30px", height: "30px" }} /> : <></>}
                        {noteInput == true ? <input placeholder="Some note" className="form-control" onChange={handleNoteOnChange} value={newNote}></input> : <></>}
                    </div>
                </div>
                {/* Error message */}
                {isError ? <div className="error-msg">{errMessage}</div> : <div></div>}
                <div className="button-group">
                    <button className="cancel-button" onClick={handleCancelButton}>
                        Cancel
                    </button>

                    <button type="submit" className="submit-button" onClick={handleSubmitButton}>
                        {buttonString}
                    </button>
                </div>
            </form>
        </div>
    );
}
