import React, {useContext, useState, useEffect} from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios'
import AppStateContext from '../AppStateContext';

export default function EditTask() {

    const { taskId } = useParams();
    const location = useLocation();
    const stateData = location.state;

    // const searchParams = new URLSearchParams(location.search);
    // const type = searchParams.get('type');

    const appState = useContext(AppStateContext);

    const [task, setTask] = useState({});



    useEffect(() => {
        //get task details from backend
        console.log(location)
        // try {
        //     axios.post(`http://localhost:8080/task/${taskId}`, {verification:  { username: appState.username, userGroupsPermitted: [], isEndPoint: false } })
        // }
        // catch(err) {
        //     console.log(err)
        // }
    })

  return (
    <div>{"taskId " + taskId +location}</div>
  )
}
