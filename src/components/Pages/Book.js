import React, { useEffect, useMemo, useState } from "react";
import "../Cards.css";
import "../Form.css";
import CardItem from "../CardItem";
import "../../App.css";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import toast from "react-hot-toast";

const cardInfo = [
    {
        image: "https://i.insider.com/50f967f56bb3f7830a000019",
        title: "test1",
    },
    {
        image: "https://i.insider.com/50f967f56bb3f7830a000019",
        title: "test1",
    },
    {
        image: "https://i.insider.com/50f967f56bb3f7830a000019",
        title: "test1",
    },
];

const renderCard = (card, index) => {
    return <CardItem src={card.image} price="" label="" path="/book" />;
};

function Book() {
    const [details, setDetails] = useState({
        name: "",
        venue: "",
        contact: "",
        email: "",
        date: "",
    });
    const { id } = useParams();

    const [designs, setDesigns] = useState([]);

    const currentDesign = useMemo(() => {
        if (designs.length > 0) {
            return designs.filter((item) => item.id === id)[0];
        }
        return null;
    }, [id, designs]);
    const bookHandler = async (e) => {
        e.preventDefault();
        toast.promise(
            new Promise(async (res, rej) => {
                try {
                    const result = await api.post("/bookings", {
                        ...details,
                        designId: currentDesign?.id,
                    });
                    res();
                } catch (e) {
                    rej(e);
                }
            }),
            {
                loading: "Booking...",
                success: "Booked",
                error: " Booking failed",
            }
        );
    };

    const fetchDesigns = async () => {
        const res = await api.get("/designs");

        setDesigns(res.data);
    };
    useEffect(() => {
        fetchDesigns();
    }, []);
    if (currentDesign === null) {
        return null;
    }

    return (
        //image section
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="cards">
                        <h1 class="h1_align">You Like this Design?</h1>
                        <h3>Name: {currentDesign.name}</h3>
                        <h3>Price: ${currentDesign.price} CAD</h3>
                        <div className="d-flex">
                            {currentDesign.images.map((item) => {
                                return (
                                    <div style={{ width: 400, height: 400, padding: 20 }}>
                                        <img
                                            className="img-fluid position-relative"
                                            style={{zIndex: 1}}
                                            src={item.url}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <form onSubmit={bookHandler}>
                        <div className="form-inner">
                            <h2>Book the Event</h2>
                            <div className="form-group">
                                <label htmlFor="name">Your Name: </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            name: e.target.value,
                                        })
                                    }
                                    value={details.name}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="venue">Venue:</label>
                                <input
                                    type="text"
                                    name="venue"
                                    id="venue"
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            venue: e.target.value,
                                        })
                                    }
                                    value={details.venue}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact">Contact:</label>
                                <input
                                    type="text"
                                    name="contact"
                                    id="contact"
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            contact: e.target.value,
                                        })
                                    }
                                    value={details.contact}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            email: e.target.value,
                                        })
                                    }
                                    value={details.email}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            date: e.target.value,
                                        })
                                    }
                                    value={details.date}
                                />
                            </div>
                            <input type="submit" value="Book" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Book;
