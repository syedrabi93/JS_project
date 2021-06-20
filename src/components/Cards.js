import React from 'react';
import './Cards.css';
import CardItem from './CardItem';



const cardInfo = [
    {
        image: 'images/design1.jpeg',
        title: "design1",
        price: "2000 CAD "
    },
    {
        image: 'images/design2.jpeg',
        title: "design2",
        price: "2000 CAD "
    },
    {
        image: "images/design5.jpeg",
        title: "design3",
        price: "2000 CAD "
    },
    {
        image: "images/design4.jpeg",
        title: "design4",
        price: "2000 CAD "
    }
]

const renderCard = (card ) => {
    return(
        <CardItem
              src={card.image}
              price={card.price}
              label={card.title}
              path='/book'
            />
    )
}

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these Designs!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>{cardInfo.map(renderCard)}</ul>
        </div>
      </div>
    </div>
  );
}

    export default Cards;