import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Pages/Home';
import Login from './components/Pages/Login';
import Book from './components/Pages/Book';
import { BrowserRouter as Router , Switch , Route } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <>
    <Router>
    <Navbar/>
    <Switch>
      <Route path='/' exact component={Home}/>
      <Route path='/login' exact component={Login}/>
      <Route path='/book' exact component={Book}/>
    </Switch>
    </Router>
    
  </>
  );
}

export default App;
