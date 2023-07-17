import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import AppStateContext from "../AppStateContext";
import DispatchStateContext from "../DispatchContext";
import Loading from "./Loading";

export default function CreatePlan() {
    const location = useLocation();

    const application = location.state;
    if (!application) {
        return <div>404 Not Found</div>;
    }
    console.log(location.state);
    const appStartdate = application.app_startdate;
    const appEnddate = application.app_enddate;

    const [planMvpName, setPlanMvpName] = useState("");
    const [applicationAcronym, setApplicationAcronym] = useState(application.app_acronym);
    const [planStartdate, setPlanStartDate] = useState("");
    const [planEnddate, setPlanEndDate] = useState("");

    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);

    const appState = useContext(AppStateContext);

    //verification
    useEffect(() => {
        async function syncBackend() {
            //only allow admin users to access
            await axios
                .post("http://localhost:8080/verifyuser", { verification: { username: appState.username, userGroupsPermitted: [application?.app_permit_open], isEndPoint: true } }, { withCredentials: true })
                .then((verified) => {
                    if (verified) {
                        if (verified.data.verified === false) {
                            setIsLoading(false);
                            return false;
                        } else {
                            setIsLoading(false);
                            return true;
                        }
                    }
                })
                .catch((err) => {
                    if (err.response.status === 401) {
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
                        let errorMessage = err.response.data.errorMessage;
                        setErrMessage(errorMessage);
                        setIsError(true);
                        setSuccessfullyCreated(false);
                    }
                });
        }

        if (syncBackend() === false) {
            axios.post("http://localhost:8080/logout", {}, { withCredentials: true }).then((res) => {
                if (res.status === 200) {
                    console.log(res.status);
                    appDispatch({ type: "logout" });
                    return navigate("/login");
                } else if (res.status !== 200) {
                    return navigate("/login");
                }
            });
        }
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
                username: appState.username,
                isEndPoint: false,
                userGroupsPermitted: [],
            },
        };
        console.log(data);
        axios
            .post("http://localhost:8080/plan/create", data, { withCredentials: true })
            .then(() => {
                setSuccessfullyCreated(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCancelButton = () => {
        return navigate(`/application/${application.app_acronym}`);
    };

    const navigate = useNavigate();

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="edit-task-for-container">
            <form onSubmit={handleCreateFormSubmit}>
                <h1>Create Plan</h1>
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
                    <input type="date" min={appStartdate ? appStartdate.substring(0, 10) : ""} max={appEnddate ? appEnddate.substring(0, 10) : ""} id="startdate" value={planStartdate ? planStartdate.substring(0, 10) : ""} onChange={handlePlanStartDateChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="enddate">End Date: </label>
                    <input type="date" min={appStartdate ? appStartdate.substring(0, 10) : ""} max={appEnddate ? appEnddate.substring(0, 10) : ""} id="enddate" value={planEnddate ? planEnddate.substring(0, 10) : ""} onChange={handlePlanEndDateChange} className="form-control" required />
                </div>

                {/* Error message */}
                {isError ? <div className="error-msg">{errMessage}</div> : <div></div>}
                {/* success message */}
                {successfullyCreated ? <div className="success-msg">Successfully created Plan. Create another one.</div> : <div></div>}
                <div className="button-group">
                    <button className="cancel-button" onClick={handleCancelButton}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-button" onSubmit={handleCreateFormSubmit}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
