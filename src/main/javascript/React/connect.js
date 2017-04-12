import React from 'react';
import ReactDOM from 'react-dom';

import AbstractApp from './AbstractApp';
import { connect as dpConnect } from 'deskproapps-sdk-core';


const instance = (UserApp) => {
  return class extends AbstractApp {
    render = () => this.renderApp(UserApp)
  };
};

const render = (DeskproApp, domselector) => {
    return dpConnect().then((dpapp) => {
        ReactDOM.render(<DeskproApp dpapp={dpapp} name="TRELLO" />, document.querySelector(domselector));
        return true;
    });
};

const connect = (app) => {
    const newApp = instance(app);
    return { render: domselector => render(newApp, domselector) };
};

export default connect;

