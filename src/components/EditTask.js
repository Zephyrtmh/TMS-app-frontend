import React, {useContext} from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios'
import AppStateContext from '../AppStateContext';

export default function EditTask({editType}) {

    const { taskId } = useParams();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');

    const appState = useContext(AppStateContext);

    [task, setTask] = useState({});



    useEffect(() => {
        //get task details from backend
        axios.post(`http://localhost:8080/task/${taskId}`, {verification:  { username: appState.username, userGroupsPermitted: [], isEndPoint: false } })
    })

  return (
    <div>{"taskId " + taskId + type}</div>
  )
}
