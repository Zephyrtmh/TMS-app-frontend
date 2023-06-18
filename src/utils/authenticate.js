import LoginPage from "../components/LoginPage";
import React from 'react';

export function authUser (component) {
    if(sessionStorage.getItem("isLoggedIn") == "true") {
        return component;
    }
    else {
        return <LoginPage />;
    }
}