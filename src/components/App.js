import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Navigation from "./Navigation";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import UserManagement from "./UserManagement";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom";
import { authUser } from "../utils/authenticate";

import AppStateContext from "../AppStateContext";
import DispatchContext from "../DispatchContext";
import axios from "axios";

function App() {
    const appState = {
        loggedIn: false,
        username: "",
        active: "",
        userGroups: [],
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            // setIsLoading(true);
            // console.log("im about to verify user");
            // try {
            //     var verified = await axios.post("http://localhost:8080/verifyuser", {}, { withCredentials: true });
            // } catch (err) {
            //     if (err.response.status === 401) {
            //         return;
            //     }
            // }
            // dispatch({ type: "login", data: verified.data.user });
            // setIsLoading(false);
        };
        try {
            verifyUser();
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    function appReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true;
                var data = action.data;
                console.log("data");
                console.log(data.userGroups);
                draft.username = data.username;
                draft.active = data.active;
                console.log("this is userGroups: ");
                data.userGroups.forEach((userGroup) => {
                    console.log(userGroup);
                    draft.userGroups.push(userGroup);
                });
                return;
            case "logout":
                draft.loggedIn = false;
                draft.username = "";
                draft.active = "";
                draft.userGroup = "";
                return;
            case "user":
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(appReducer, appState);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <AppStateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <BrowserRouter>
                        <Navigation />
                        <Routes>
                            <Route path="*" element={authUser(state, <LandingPage />)} replace />
                            {/* <Route exact path="/home" element={(authUser(state, <LandingPage />), ["admin"])} /> */}
                            <Route exact path="/home" element={authUser(state, <LandingPage />, [])} />
                            <Route exact path="/usermanagement" element={authUser(state, <UserManagement />, ["admin"])} />
                            {/* <Route exact path="/usermanagement" element={<UserManagement />} /> */}
                            <Route exact path="/user/:username" element={<EditUser />} />
                            <Route exact path="/user/create" element={<AddUser />} />
                            {/* <Route exact path="/usermanagement" element={<UserManagement />} /> */}
                            <Route exact path="/" element={authUser(state, <LandingPage />)} />
                            <Route exact path="/login" element={<LoginPage />} />
                        </Routes>
                    </BrowserRouter>
                </DispatchContext.Provider>
            </AppStateContext.Provider>
        </>
    );
}

export default App;
