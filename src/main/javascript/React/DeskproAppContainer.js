import React, { PropTypes } from 'react';
import { Container, Header, Segment, Icon, Menu, Loader, Image } from 'semantic-ui-react/src';

import { AppEvents, UIEvents, UIConstants } from '@deskproapps/deskproapps-sdk-core';

class DeskproAppContainer extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired
    , name: PropTypes.string.isRequired
    , mainComponent: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.registerListeners();
  }

  registerListeners = () =>
  {
    const { app } = this.props;

    const forceUpdateTrigger = () => this.forceUpdate();

    app.on(AppEvents.EVENT_EXPAND, forceUpdateTrigger);
    app.on(AppEvents.EVENT_COLLAPSE, forceUpdateTrigger);
    app.on(UIEvents.EVENT_STATE_TRANSITION, forceUpdateTrigger);
    app.on(UIEvents.EVENT_MENU_STATE_TRANSITION, forceUpdateTrigger);
    app.on(UIEvents.EVENT_BADGE_COUNTCHANGED, forceUpdateTrigger);
    app.on(UIEvents.EVENT_BADGE_VISIBILITYCHANGED, forceUpdateTrigger);
  };

  renderOptions = () => {
    const { visibility, ui } = this.props.app;

    if (ui.menu === 'hidden') {
      return ( <Menu.Menu position="right" /> );
    }

    if (visibility === 'collapsed') {
      return this.renderOptionsWhenCollapsed();
    }
    return this.renderOptionsWhenExpanded();
  };

  renderOptionsWhenCollapsed =() => {
    const { app } = this.props;
    const collapseListener = () => app.visibility === 'collapsed' ? app.expand() : app.collapse();

    return (
      <Menu.Menu position="right" >
        <Menu.Item name="collapse" active={false} fitted onClick={collapseListener} className={"app-option"}>
          <Icon name="caret down" size="large"/>
        </Menu.Item>
      </Menu.Menu>
    );
  };

  renderOptionsWhenExpanded =() => {
    const { app } = this.props;
    const collapseListener = () => app.visibility === 'collapsed' ? app.expand() : app.collapse();

    const options = [
      <Menu.Item name="refresh" active={false} fitted onClick={app.refresh} className={"app-option"}>
        <Icon name="refresh" />
      </Menu.Item>
    ];

    const hasSettings = app.settings.length > 0;
    if (hasSettings) {
      options.push(
        <Menu.Item name="settings" active={false} fitted onClick={app.ui.showSettings} className={"app-option"}>
          <Icon name="setting" />
        </Menu.Item>
      );
    }

    options.push(
      <Menu.Item name="collapse" active={false} fitted onClick={collapseListener} className={"app-option big"}>
        <Icon name="caret up" />
      </Menu.Item>
    );

    return (<Menu.Menu position="right">{ options} </Menu.Menu>);
  };

  renderAppBadge = app =>
  {
    const { badgeCount } = app.ui;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18">
        <g>
          <circle cx="9" cy="9" r="9" fill="red"/>
          <text y="12" transform="translate(9)" fontSize="10px" fill="white" stroke="white">
            <tspan x="0" textAnchor="middle">{badgeCount}</tspan>
          </text>
        </g>
      </svg>
    );
  };

  renderAppHeader = (name, app) => {

    return (
      <Menu.Item className={"app-header"}>
        <Header size="tiny">
          <div style={{ position: 'relative' }} className="ui icon deskpro-app-icon">
            {
              app.ui.badge === UIConstants.VISIBILITY_VISIBLE &&
              <div style={{ position: 'absolute', top: '-9px', right: '-9px' }}>
                { this.renderAppBadge(app) }
              </div>
            }
            <img src="../assets/icon.png" style={{ width: '16px', height: '16px', border: 0}}/>
          </div>
          <Header.Content> {name.toUpperCase()} </Header.Content>
        </Header>
      </Menu.Item>
    );
  };

  renderAppContent = (Content, app, props) => {
    const invisibleStyle = { visibility: 'hidden', display: 'none' };

    const { visibility, ui } = app;
    const contentStyle = ui.state === 'loading' || visibility === 'collapsed'  ? invisibleStyle : {};

    return (
      <div style={contentStyle} id="dp-app-container">
        <Segment attached="bottom" className={"app-body"}>
            <Content dpapp={ app } />
        </Segment>
      </div>
    );
  };

  renderAppLoader = () => {
    const invisibleStyle = { visibility: 'hidden', display: 'none' };

    const { app } = this.props;
    const contentStyle = app.ui.state === 'loading' ? {} : invisibleStyle;

      return (
        <div style={contentStyle} id="dp-app-loader">
          <Segment attached="bottom" className={"app-body"}>
            <Loader active={true} inline="centered" />
          </Segment>
        </div>
      );
  };

  render = () => {
    const { app, mainComponent, name, ...passThroughProps } = this.props;

    return (
      <Container>
        <Menu borderless attached="top" className={"app-menu"}>
          { this.renderAppHeader(name, app) }
          { this.renderOptions() }
        </Menu>
        { this.renderAppLoader() }
        { this.renderAppContent(mainComponent, app, passThroughProps) }
      </Container>
    );
  };

}

export default DeskproAppContainer;
