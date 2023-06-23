import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Navigation from "./Navigation";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import UserManagement from "./UserManagement";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
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

    useEffect(() => {
        const storedState = localStorage.getItem("appState");
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            dispatch({ type: "login", data: parsedState });
        }
    }, []);

    function appReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true;
                const data = action.data;
                console.log("data: " + data.username + data.active + data.userGroup);
                draft.username = data.username;
                draft.active = data.active;
                draft.userGroup = data.userGroup;
                localStorage.setItem("appState", JSON.stringify(draft));
                return;
            case "logout":
                draft.loggedIn = false;
                localStorage.removeItem("appState");
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
