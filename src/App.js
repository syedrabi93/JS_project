import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Pages/Home";
import Login from "./components/Pages/Login";
import Book from "./components/Pages/Book";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import  { Toaster } from 'react-hot-toast';

import "./App.css";
import { Admin } from "./components/Pages/Admin";
import { AddNew } from "./components/Pages/AddNew";

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/admin" exact component={Admin} />
                    <Route path="/admin/new" exact component={AddNew} />
                    <Route path="/book" exact component={Book} />
                </Switch>
                <Toaster />
            </Router>
        </>
    );
}

export default App;
