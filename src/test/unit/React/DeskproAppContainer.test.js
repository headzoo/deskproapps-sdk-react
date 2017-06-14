// Link.react.js
import React from 'react';
import { createAppFromProps } from '@deskproapps/deskproapps-sdk-core';
import renderer from 'react-test-renderer';

import DeskproAppContainer from '../../../main/javascript/React/DeskproAppContainer'

class TestApp extends React.Component
{
  render() { return (<div>Hello World</div>); }
}

test('successfully render an application in initial state', done => {

  const dpapp = createAppFromProps({
    // context
    contextType: 'ticket',
    contextEntityId: '1',
    contextLocationId: 'ticket-sidebar',
    contextTabId: 'tab-id',

    // instance

    appId: '1',
    appTitle: 'test',
    appPackageName: 'com.deskpro.test',
    instanceId: '1'
  });

  const component = renderer.create(
    <DeskproAppContainer app={dpapp} name="Test App" mainComponent={TestApp} />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  done();
});

test('successfully render an application with the badge count visible', done => {

  const dpapp = createAppFromProps({
    // context
    contextType: 'ticket',
    contextEntityId: '1',
    contextLocationId: 'ticket-sidebar',
    contextTabId: 'tab-id',

    // instance

    appId: '1',
    appTitle: 'test',
    appPackageName: 'com.deskpro.test',
    instanceId: '1'
  });

  dpapp.ui.showBadgeCount();

  const component = renderer.create(
    <DeskproAppContainer app={dpapp} name="Test App" mainComponent={TestApp} />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  done();
});