import React from "react";
import axios from "axios";

export default function LandingPage() {
    const handleTest = () => {
        axios.get("http://localhost:8080/user/all", {}, { withCredentials: true }).then((res) => {});
    };

    return <div>LandingPage</div>;
}
