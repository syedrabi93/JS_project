import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000",
    transformRequest: [
        ...axios.defaults.transformResponse,
        (req, headers) => {
            const token = localStorage.getItem("AuthToken");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            return req;
        },
    ],
});
