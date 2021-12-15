import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {ErrorContextProvider} from "./ErrorContext";


ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/(.*)" render={({location}) => (
                <ErrorContextProvider>
                    <App location={location}/>
                </ErrorContextProvider>
            )}/>
            <Redirect to="/"/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root'),
);
