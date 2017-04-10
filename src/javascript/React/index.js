import React from 'react';
import ReactDOM from 'react-dom';
import AbstractApp from './AbstractApp';
import * as Core from '../Core';

function instance(UserApp) {
  return class extends AbstractApp {
    render = () => this.renderApp(UserApp)
  };
}

function render(DeskproApp, domselector) {
  return Core.dpapp.onMount().then(() => {
    ReactDOM.render(<DeskproApp dpapp={Core.dpapp} name="TRELLO" />, document.querySelector(domselector));
    return true;
  });
}

function connect(app) {
  const newApp = instance(app);
  return { render: domselector => render(newApp, domselector) };
}

export { instance, render };
export default connect;

