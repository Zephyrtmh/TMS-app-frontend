import React from "react";
import "../styles/taskcard.css";

export default function TaskCard(task) {
    return (
        <div className="task-card-container">
            <div className="colour-bar" style={{ backgroundColor: task.plan_colour }}></div>
            <div>{task.task_name}</div>
            <div>{task.task_id}</div>
            <div>{task.task_owner}</div>
            <div>{task.task_createdate}</div>
            <button>Demote</button>
            <button>Edit</button>
            <button>Promote</button>
        </div>
    );
}
