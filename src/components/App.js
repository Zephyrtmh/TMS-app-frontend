import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Navigation from "./Navigation";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import UserManagement from "./UserManagement";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { authUser } from "../utils/authenticate";

import AppStateContext from "../AppStateContext";
import DispatchContext from "../DispatchContext";

function App() {
    const appState = {
        loggedIn: false,
        username: "",
        active: "",
        userGroup: "",
    };

    // useEffect(() => {
    //     localStorage.setItem("username", appState.username);
    //     localStorage.setItem("active", appState.active);
    //     localStorage.setItem("userGroup", appState.userGroup);
    //     localStorage.setItem("loggedIn", appState.loggedIn);
    //     // appState.username = localStorage.username;
    //     // appState.active = localStorage.active;
    //     // appState.userGroup = localStorage.userGroup;
    //     // appState.loggedIn = localStorage.loggedIn;
    // }, [appState.loggedIn]);

    function appReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true;
                const data = action.data;
                console.log("data: " + data.username + data.active + data.userGroup);
                draft.username = data.username;
                draft.active = data.active;
                draft.userGroup = data.userGroup;
                return;
            case "logout":
                draft.loggedIn = false;
                return;
            case "user":
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(appReducer, appState);

    return (
        <>
            <AppStateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <BrowserRouter>
                        <Navigation />
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/home" element={(authUser(state, <LandingPage />), ["admin"])} />
                            <Route path="/usermanagement" element={authUser(state, <UserManagement />, ["admin"])} />
                            <Route path="*" element={authUser(state, <LandingPage />)} replace />
                        </Routes>
                    </BrowserRouter>
                </DispatchContext.Provider>
            </AppStateContext.Provider>
        </>
    );
}

export default App;
