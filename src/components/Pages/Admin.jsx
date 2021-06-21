import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../../api";
import toast from "react-hot-toast";

export const Admin = () => {
    const [designs, setDesigns] = useState([]);
    const fetchDesigns = async () => {
        const res = await api.get("/designs");
        console.log(res.data);
        setDesigns(res.data);
    };
    useEffect(() => {
        fetchDesigns();
    }, []);
    const history = useHistory();

    const gotoAddNew = () => {
        history.push("/admin/new");
    };

    const handleDelete = (i) => async () => {
        const promise = new Promise(async (res, rej) => {
            try {
                await api.delete(`/designs/${designs[i].id}`);
                await fetchDesigns();
                res();
            } catch (e) {
                rej(e);
            }
        });
        toast.promise(promise, {
            loading: "Deleting...",
            success: "Deleted",
            error: "Failed",
        });
    };

    return (
        <>
            <h1 className="my-4">Admin Page</h1>
            <div className="container">
                <div className="row my-3 justify-content-end">
                    <div className="col-md-2">
                        <button
                            className="btn btn-success"
                            onClick={gotoAddNew}
                        >
                            Add New
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {designs.map((item, i) => {
                                    return (
                                        <tr>
                                            <th scope="row">{i + 1}</th>
                                            <td>{item.name}</td>
                                            <td>{item.price} CAD</td>
                                            <td>
                                                <img
                                                    className="img-fluid"
                                                    style={{ width: 50 }}
                                                    src={item.images[0]?.url}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    onClick={handleDelete(i)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
