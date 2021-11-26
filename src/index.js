import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";


ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/(.*)" component={App} />
            <Redirect to="/" />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root'),
);
