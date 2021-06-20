import React, { useState } from "react";
import '../Cards.css';
import '../Form.css';
import CardItem from '../CardItem';
import '../../App.css';
import { Card } from "react-bootstrap";


const cardInfo = [
  {
    image: "https://i.insider.com/50f967f56bb3f7830a000019",
    title: 'test1'
  },
  {
    image: "https://i.insider.com/50f967f56bb3f7830a000019",
    title: 'test1'
  },
  {
    image: "https://i.insider.com/50f967f56bb3f7830a000019",
    title: 'test1'
  }
]



const renderCard = (card, index) => {
  return (
    <CardItem
      src={card.image}
      price=""
      label=""
      path='/book'
    />
  );
};


function Book() {

  const [details, setDetails] = useState({ name: "", venue: "", contact: "", email: "", date: "" })
  const bookHandler = e => {
    //BookEvent(details);
  }


  return (
    //image section
    <div className="splitScreen">
      <div className="topPane">
        <div className='cards'>
          <h1 class="h1_align">You Like this Design?</h1>
          <div className='cards__wrapper'>
            <div className='book__item__img'>{cardInfo.map(renderCard)}</div>
          </div>
        </div>
      </div>

      {/*form section*/}
      <div className="bottomPane">
        <form onSubmit={bookHandler}>
          <div className="form-inner">
            <h2>Book the Event</h2>
            <div className="form-group">
              <label htmlFor="name">Name: </label>
              <input type="text" name="name" id="name" onChange={e => setDetails({ ...details, name: e.target.value })} value={details.name} />
            </div>
            <div className="form-group">
              <label htmlFor="venue">Venue:</label>
              <input type="text" name="venue" id="venue" onChange={e => setDetails({ ...details, venue: e.target.value })} value={details.venue} />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Contact:</label>
              <input type="text" name="contact" id="contact" onChange={e => setDetails({ ...details, contact: e.target.value })} value={details.contact} />
            </div>
            <div className="form-group">
              <label htmlFor="email">email:</label>
              <input type="email" name="email" id="email" onChange={e => setDetails({ ...details, email: e.target.value })} value={details.email} />
            </div>
            <div className="form-group">
              <label htmlFor="name">Date:</label>
              <input type="date" name="date" id="date" onChange={e => setDetails({ ...details, date: e.target.value })} value={details.date} />
            </div>
            <input type="submit" value="Book" />
          </div>
        </form>
      </div>

    </div>



  );
};

export default Book;