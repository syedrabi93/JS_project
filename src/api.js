import axios from "axios";

export const api = axios.create({
    baseURL: "https://lampton-api.app.zap-torrent.com",
    transformRequest: [
        ...axios.defaults.transformRequest,
        (req, headers) => {
            const token = localStorage.getItem("AuthToken");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            return req;
        },
    ],
});
