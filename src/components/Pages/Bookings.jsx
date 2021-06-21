import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../../api";
import toast from "react-hot-toast";

export const Bookings = () => {
    const [bookings, setbookings] = useState([]);
    const fetcheBookings = async () => {
        const res = await api.get("/bookings");
        console.log(res.data);
        setbookings(res.data);
    };
    useEffect(() => {
        fetcheBookings();
    }, []);



    const handleDelete = (i) => async () => {
        const promise = new Promise(async (res, rej) => {
            try {
                await api.delete(`/bookings/${bookings[i].id}`);
                await fetcheBookings();
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
            <h1 className="my-4">Bookings List</h1>
            <div className="container">
               
                <div className="row">
                    <div className="col-md-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Venue</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Contact</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((item, i) => {
                                    return (
                                        <tr>
                                            <th scope="row">{i + 1}</th>
                                            <td>{item.name}</td>
                                            <td>{item.venue}</td>
                                            <td>
                                               {item.date}
                                            </td>
                                            <td>
                                               {item.contact}
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
