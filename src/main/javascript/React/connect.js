import React from 'react';
import ReactDOM from 'react-dom';

import AbstractApp from './AbstractApp';
import { connect as dpConnect } from '@deskproapps/deskproapps-sdk-core';


const instance = (UserApp) => {
  return class extends AbstractApp {
    render = () => this.renderApp(UserApp)
  };
};

const render = (DeskproApp, name, domselector) => {
    return dpConnect().then((dpapp) => {
        ReactDOM.render(<DeskproApp dpapp={dpapp} name={name} />, document.querySelector(domselector));
        return true;
    });
};

const connect = (app, appName) => {
    const newApp = instance(app);
    return { render: domselector => render(newApp, appName, domselector) };
};

export default connect;

