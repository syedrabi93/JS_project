import { useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { api } from "../../api";

const useInputState = (val) => {
    const [state, setState] = useState(val);
    const onChange = (e) => {
        setState(e.target.value);
    };
    return [state, onChange];
};

export const AddNew = () => {
    const [name, setName] = useInputState("");
    const [price, setPrice] = useInputState("");
    const [images, setImages] = useState([]);
    const history = useHistory();
    const handleFiles = (e) => {
        setImages(e.target.files);
    };
    const handleSubmit = async () => {
        const promise = new Promise(async (resolve, rej) => {
            try {
                const form = new FormData();
                form.append("name", name);
                form.append("price", price);
                for (let i = 0; i < images.length; i++) {
                    form.append("images", images[i]);
                }

                await api.post("/designs", form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                history.push("/admin");
                resolve();
            } catch (e) {
                rej();
            }
        });

        toast.promise(promise, {
            loading: "Adding...",
            success: "New Design Added",
            error: "Failed",
        });
    };

    return (
        <>
            <h1> Add New Design</h1>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="mb-3 ">
                            <label className=" col-form-label">Name</label>
                            <div className="">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={setName}
                                />
                            </div>
                        </div>
                        <div className="mb-3 ">
                            <label className=" col-form-label">
                                Price (CAD)
                            </label>
                            <div className="">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={price}
                                    onChange={setPrice}
                                />
                            </div>
                        </div>
                        <div className="mb-3 ">
                            <label className=" col-form-label">Add Image</label>
                            <div className="">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFiles}
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
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
