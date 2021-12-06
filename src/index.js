import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";


ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/(.*)" component={App} />
            <Redirect to="/" />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root'),
);
