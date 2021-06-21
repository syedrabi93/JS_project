import React from "react";
import { useState } from "react";
import { api } from "../../api";
import "../../App.css";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";

const useInputState = (val) => {
    const [state, setState] = useState(val);
    const onChange = (e) => {
        setState(e.target.value);
    };
    return [state, onChange];
};

export default function Login() {
    const [username, setUsername] = useInputState("");
    const [password, setPassword] = useInputState("");
    const history = useHistory();

    const handleSubmit = async () => {
        const promise = new Promise(async resolve => {
            const res = await api.post('/login', {username, password});
            localStorage.setItem("AuthToken", res.data.token);
            history.push('/admin');
            resolve()
        })
        toast.promise(promise, {
            loading: "Checking...",
            success: "Logged In",
            error: "Invalid username or password"
        })
    }


    return (
        <>
            <h1 className="login my-5"> Login</h1>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="mb-3 row">
                            <label
                                for="staticEmail"
                                className="col-sm-2 col-form-label"
                            >
                                Username
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="staticEmail"
                                    value={username}
                                    onChange={setUsername}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                for="inputPassword"
                                className="col-sm-2 col-form-label"
                            >
                                Password
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="inputPassword"
                                    value={password}
                                    onChange={setPassword}
                                />
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-6 d-flex justify-content-center">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    class="btn btn-primary my-3"
                                >
                                    Log in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
