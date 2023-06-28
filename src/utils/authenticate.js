import LoginPage from "../components/LoginPage";
import React from "react";
import axios from "axios";
import LandingPage from "../components/LandingPage";

export function authUser(appState, component, allowed = []) {
    //sync with backend
    // try {
    //     const user = await axios.post("http://localhost:8080/verifyuser", {}, { withCredentials: true });
    // } catch (err) {
    //     console.log(err);
    // }

    if (allowed.length === 0) {
        if (appState.loggedIn == true && appState.active === "active") {
            return component;
        }
    }
    console.log(appState.userGroup + appState.loggedIn);
    if (allowed.some((allowed) => appState.userGroups.includes(allowed)) && appState.loggedIn == true && appState.active === "active") {
        // axios.post();

        return component;
    } else {
        return <LandingPage />;
    }
}
