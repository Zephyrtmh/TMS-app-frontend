import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Navigation from "./Navigation";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import UserManagement from "./UserManagement";
import EditUser from "./EditUser";
import CreateUser from "./CreateUser";
import Profile from "./Profile";
import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom";

import AppStateContext from "../AppStateContext";
import DispatchContext from "../DispatchContext";
import axios from "axios";
import ApplicationManagement from "./ApplicationManagement";
import ViewApplication from "./ViewApplication";
import EditTask from "./EditTask";
import CreatePlan from "./CreatePlan";
import CreateApplication from "./CreateApplication";
import CreateTask from "./CreateTask";

function App() {
    const appState = {
        loggedIn: false,
        username: "",
        active: "",
        userGroups: [],
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function syncBackend() {
            //only allow admin users to access
            try {
                console.log("before running verifyuser");
                console.log(appState.loggedIn);
                console.log("test: " + appState.username);
                var verified = await axios.post("http://localhost:8080/verifyuser", { verification: { username: "", userGroupsPermitted: [], isEndPoint: true } }, { withCredentials: true });
                console.log(verified);
                if (verified.data.verified === false) {
                    setIsLoading(false);
                    return false;
                } else {
                    setIsLoading(false);
                    const data = {
                        username: verified.data.user.username,
                        userGroups: verified.data.user.userGroups,
                        active: verified.data.user.active,
                    };

                    dispatch({ type: "login", data: data });

                    return verified;
                }
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        }

        var verified = syncBackend();

        return () => {
            isMounted = false;
            setIsLoading(false);
        };

        // const verifyUser = async () => {
        //     setIsLoading(true);

        //     console.log("im about to verify user");
        //     try {
        //         var verified = await axios.post("http://localhost:8080/verifyuser", {}, { withCredentials: true });
        //     } catch (err) {
        //         if (err.response.status === 401) {
        //             return;
        //         }
        //     }
        //     console.log(verified);
        //     // dispatch({ type: "login", data: verified.data.user });
        //     setIsLoading(false);
        // };
        // try {
        //     syncBackend();
        // } catch (err) {
        //     console.log(err);
        // } finally {
        //     setIsLoading(false);
        // }
    }, []);

    function appReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true;
                var data = action.data;
                draft.username = data.username;
                draft.active = data.active;
                data.userGroups.forEach((userGroup) => {
                    console.log(userGroup);
                    draft.userGroups.push(userGroup);
                });
                return;
            case "logout":
                draft.loggedIn = false;
                draft.username = "";
                draft.active = "";
                draft.userGroups = [];
                return;
            case "user":
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(appReducer, appState);

    if (isLoading) {
        return (
            <>
                <div>Loading...</div>
            </>
        );
    }

    return (
        <>
            <AppStateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <BrowserRouter>
                        <Navigation />
                        <Routes>
                            <Route path="*" element={<LandingPage />} replace />
                            {/* <Route exact path="/home" element={(authUser(state, <LandingPage />), ["admin"])} /> */}
                            <Route exact path="/home" element={<LandingPage />} />
                            {/* <Route exact path="/usermanagement" element={authUser(state, <UserManagement />, ["admin"])} /> */}
                            <Route exact path="/usermanagement" element={<UserManagement />} />
                            <Route exact path="/applicationmanagement" element={<ApplicationManagement />} />
                            <Route exact path="/application/:appAcronym" element={<ViewApplication />} />
                            <Route exact path="/task/:taskId" element={<EditTask />} />
                            <Route exact path="/user/:username" element={<EditUser />} />
                            <Route exact path="/plan/create" element={<CreatePlan />} />
                            <Route exact path="/application/create" element={<CreateApplication />} />
                            <Route exact path="/task/create" element={<CreateTask />} />
                            <Route exact path="/profile/:username" element={<Profile />} />
                            <Route exact path="/user/create" element={<CreateUser />} />
                            <Route exact path="/" element={<LandingPage />} />
                            <Route exact path="/login" element={<LoginPage />} />
                        </Routes>
                    </BrowserRouter>
                </DispatchContext.Provider>
            </AppStateContext.Provider>
        </>
    );
}

export default App;
