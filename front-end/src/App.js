import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import HomeComponent from "./components/HomeComponent";

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <HomeComponent/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}
