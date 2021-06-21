import React, { useEffect, useState } from "react";
import "./Cards.css";
import CardItem from "./CardItem";
import { api } from "../api";

function Cards() {
    const [designs, setDesigns] = useState([]);

    const fetchDesigns = async () => {
      const res = await api.get("/designs");
      console.log(res.data);
      setDesigns(res.data);
    };
    useEffect(() => {
      fetchDesigns();
    }, []);

    return (
        <div className="cards">
            <h1>Check out these Designs!</h1>
            <div className="cards__container">
                <div className="cards__wrapper">
                    <ul className="cards__items">
                        {designs.map((item) => {
                            return (
                                <CardItem
                                    src={item.images[0].url}
                                    price={item.price}
                                    label={item.name}
                                    path={`/book/${item.id}`}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Cards;
