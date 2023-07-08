import React from "react";
import "../styles/taskcard.css";

import AppStateContext from "../AppStateContext";

export default function TaskCard(task) {

    const appState = useContext(AppStateContext);

    const handleEditButtonClick = (e) => {
        
    };

    return (
        <div className="task-card-container">
            <div className="colour-bar" style={{ backgroundColor: task.plan_colour }}></div>
            <div>{task.task_name}</div>
            <div>{task.task_id}</div>
            <div>{task.task_owner}</div>
            <div>{task.task_createdate}</div>
            <button onClick="handleEditButtonClick">Demote</button>
            <button onClick="handleEditButtonClick">Edit</button>
            <button onClick="handleEditButtonClick">Promote</button>
        </div>
    );
}
