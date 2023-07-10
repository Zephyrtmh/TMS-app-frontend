import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import AppStateContext from "../AppStateContext";
import DispatchStateContext from "../DispatchContext";

export default function CreatePlan() {
    const location = useLocation();
    const application = location.state;
    console.log(location.state);
    const appStartdate = application.app_startdate;
    const appEnddate = application.app_enddate;

    const [planMvpName, setPlanMvpName] = useState("");
    const [applicationAcronym, setApplicationAcronym] = useState(application.app_acronym);
    const [planStartdate, setPlanStartDate] = useState("");
    const [planEnddate, setPlanEndDate] = useState("");

    const [isError, setIsError] = useState(false);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);

    //verify user
    useEffect(() => {
        const retrieveData = async () => {
            console.log(application);
            // axios.post(`http://localhost:8080/application/${location.state}`);
        };

        retrieveData();
    }, []);

    //retrieve data
    useEffect(() => {
        const retrieveData = async () => {
            console.log(application);
            // axios.post(`http://localhost:8080/application/${location.state}`);
        };

        retrieveData();
    }, []);

    const handlePlanMvpNameChange = (e) => {
        setPlanMvpName(e.target.value);
    };

    const handlePlanStartDateChange = (e) => {
        setPlanStartDate(e.target.value);
    };

    const handlePlanEndDateChange = (e) => {
        setPlanEndDate(e.target.value);
    };

    const handleCreateFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            plan_mvp_name: planMvpName,
            plan_startdate: planStartdate,
            plan_enddate: planEnddate,
            plan_app_acronym: application.app_acronym,
            verification: {
                username: "admin",
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };
        console.log(data);
        axios
            .post("http://localhost:8080/plan/create", data, { withCredentials: true })
            .then(() => {
                return navigate(`/application/${application.app_acronym}`);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCancelButton = () => {};

    const navigate = useNavigate();

    return (
        <div className="edit-form-container">
            <form onSubmit={handleCreateFormSubmit}>
                <h1></h1>
                <div className="form-group">
                    <label htmlFor="planname">Plan MVP Name:</label>
                    <input type="text" id="planname" value={planMvpName} onChange={handlePlanMvpNameChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="application">Application:</label>
                    <input type="text" id="application" readOnly value={applicationAcronym} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="startdate">Start Date: </label>
                    <input type="date" min={appStartdate ? appStartdate.substring(0, 10) : ""} max={appEnddate ? appEnddate.substring(0, 10) : ""} id="startdate" value={planStartdate ? planStartdate.substring(0, 10) : ""} onChange={handlePlanStartDateChange} className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="enddate">End Date: </label>
                    <input type="date" min={appStartdate ? appStartdate.substring(0, 10) : ""} max={appEnddate ? appEnddate.substring(0, 10) : ""} id="enddate" value={planEnddate ? planEnddate.substring(0, 10) : ""} onChange={handlePlanEndDateChange} className="form-control" required />
                </div>

                {/* Error message */}
                {isError ? <div className="error-msg">{errMessage}</div> : <div></div>}
                {/* success message */}
                {successfullyCreated ? <div className="success-msg">Successfully created User. Create another one.</div> : <div></div>}
                <div className="button-group">
                    <button className="cancel-button" onClick={handleCancelButton}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-button" onClick={handleCreateFormSubmit}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
