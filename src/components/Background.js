import React from 'react';
import '../App.css';
import { Button } from './Button';
import './Background.css';
import { Link } from 'react-router-dom';


function Background() {
    return (
        <div className='bg-container'>
            
            <h1> Wedding Stage Decorators</h1>
            <p>Your Dream come true </p>
            <br></br>
            <div className='hero-btns'>
                <Button
                
                    className='btns'
                    buttonStyle='btn--outline'
                    buttonSize='btn--large'
                >
                    GET STARTED
                    <Link to='/sign-up' className='btn-mobile'></Link>
                </Button>
            </div>
        </div>

    )
}

export default Background;