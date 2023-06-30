import axios from "axios";

const syncBackend = async (appState) => {
    //only allow admin users to access
    try {
        var verified = await axios.post("http://localhost:8080/verifyuser", { username: appState.username, userGroupsPermitted: ["admin"] }, { withCredentials: true });
        console.log("after sending call to verifyuser: " + verified.verified);
        if (verified.data.verified === false) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        throw err;
    }
};

export default syncBackend;
