import React, { PropTypes } from 'react';
import { Container, Header, Segment, Icon, Menu, Loader } from 'semantic-ui-react/src';
import { ChildApp } from 'deskproapps-sdk-core';

import * as UICommand from '../UICommand';

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

function mergeDeep(target, source) {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }
  return target;
}

function mergeState(newState, state) {
  const newStateKeys = Object.keys(newState);
  if (newStateKeys.length === 0) {
    return {};
  }

  // extract only the keys present in the new state object
  const target = {};
  newStateKeys.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      target[key] = state[key];
    }
  });
  return mergeDeep(target, newState);
}

class AbstractApp extends React.Component {
  static propTypes = {
    dpapp: PropTypes.object
    , name: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.initState();
    this.childapp = new ChildApp();
  }

  initState = () => {
    this.state = {
      layout: 'full',
      options: {
        visible: true
      },
      loader: {
        visible: true
      }
    };
  };

  onUICommand = (commandName, options) => {
    const { childapp } = this;
    const command = UICommand.fromString(commandName);
    const state = command !== null ? command.handle(childapp, options) : state;

    const newState = mergeState(state, this.state);
    this.setState(newState);
  };

  onCollapse = () => {
    const { layout } = this.state;
    const newLayout = layout === 'collapsed' ? 'full' : 'collapsed';

    this.setState({ layout: newLayout });
    this.childapp.onCollapse();
  };

  renderOptions = () => {

    const { layout, options } = this.state;

    if (!options.visible) {
      return (
        <Menu.Menu position="right" />
      );
    }

    if (layout === 'collapsed') {
      return (
        <Menu.Menu position="right" >
          <Menu.Item name="collapse" active={false} fitted onClick={this.onCollapse}>
            <Icon name="caret up" />
          </Menu.Item>
        </Menu.Menu>
      );
    }

    return (
      <Menu.Menu position="right" >
        <Menu.Item name="refresh" active={false} fitted onClick={this.childapp.onRefresh}>
          <Icon name="refresh" />
        </Menu.Item>

        <Menu.Item name="settings" active={false} fitted onClick={this.childapp.onSettings}>
          <Icon name="setting" />
        </Menu.Item>

        <Menu.Item name="collapse" active={false} fitted onClick={this.onCollapse}>
          <Icon name="caret up" />
        </Menu.Item>
      </Menu.Menu>
    );
  };

  renderAppHeader = (name) => {
    return (
      <Menu.Item>
        <Header size="small">
          <Icon name="cubes" />
          <Header.Content> {name} </Header.Content>
        </Header>
      </Menu.Item>
    );
  };

  renderAppContent = (Content, dpapp, props) => {

    const { layout, loader } = this.state;
    let conteStyle;
    const ui = UICommand.commandChain(this.onUICommand);

    if (layout === 'collapsed' || loader.visible) {
      conteStyle = { visibility: 'hidden' };
    }

    return (
      <Segment attached="bottom">
        <Loader active={loader.visible} inline="centered" />
        <div style={conteStyle}>
          <Content dpapp={dpapp} ui={ui} {...props} />
        </div>
      </Segment>
    );
  };

  renderApp = (App) => {
    const { dpapp, name, ...passThroughProps } = this.props;

    return (
      <Container>

        <Menu size="huge" borderless attached="top">
          { this.renderAppHeader(name) }
          { this.renderOptions() }
        </Menu>

        { this.renderAppContent(App, dpapp, passThroughProps) }

      </Container>
    );
  };

  render() {
    throw new Error('render must be implemented in a subclass');
  }
}

export default AbstractApp;
