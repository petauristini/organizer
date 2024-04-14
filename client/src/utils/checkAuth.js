import axios from "axios";

const checkAuth = async () => {
    try {
        const response = await axios.get("/api/check-auth");
        return response.data;
    } catch (error) {
        return false;
    }
}

export default checkAuth;