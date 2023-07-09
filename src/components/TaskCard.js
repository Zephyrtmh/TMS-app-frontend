import "../styles/taskcard.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TaskCard(task) {

    const navigate = useNavigate();

    const handlePromoteButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=promote`);
    };

    const handleEditButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=edit`);
    };

    const handleDemoteButtonClick = (taskId) => {
        navigate(`/task/${taskId}?type=demote`, {state: task});
    };

    return (
        <div className="task-card-container">
            <div className="colour-bar" style={{ backgroundColor: task.plan_colour }}></div>
            <div>{task.task_name}</div>
            <div>{task.task_id}</div>
            <div>{task.task_owner}</div>
            <div>{task.task_createdate}</div>
            <button onClick={() => {handleDemoteButtonClick(task.task_id)}}>Demote</button>
            
                {/* <Link to={{ pathname:`/task/${task.task_id}`,search: "?type=demote"}} state={task}><button>Demote</button></Link> */}
            
            <button onClick={() => {handleEditButtonClick(task.task_id)}}>Edit</button>
            <button onClick={() => {handlePromoteButtonClick(task.task_id)}}>Promote</button>
        </div>
    );
}
