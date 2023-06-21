import LoginPage from "../components/LoginPage";
import React from "react";
import axios from "axios";

export function authUser(appState, component, allowed = []) {
    if (allowed.length === 0) {
        if (appState.loggedIn == true) {
            return component;
        }
    }
    console.log(appState.userGroup + appState.loggedIn);
    if (allowed.includes(appState.userGroup) && appState.loggedIn == true) {
        // axios.post();

        return component;
    } else {
        return <LoginPage />;
    }
}
