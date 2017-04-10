import React from 'react';

import { UniformsFormBridge } from '../Uniforms';
import * as FieldTypes from './FieldTypes';
import FormFields from './FormFields';

const injectFormBridge = (children, formBridge) => React.Children.map(children, child => {
  if (!React.isValidElement(child)) {
    return child;
  }

  const injectedProps = FieldTypes.isType(child.type) || child.type === FormFields ? { formBridge } : null;
  const injectedChildren = child.props && child.props.children ? injectFormBridge(child.props.children, formBridge) : null;

  if (!injectedProps && !injectedChildren) {
    return child;
  }

  if (!injectedChildren) {
    return React.cloneElement(child, injectedProps);
  }

  return React.cloneElement(child, { formBridge }, injectedChildren);
});

const emptyFunction = () => {};

const Form = ({ fields, model, children, onChange, ...passthrough }) => {
  const uniformsBridge = new UniformsFormBridge();

  const AutoForm = uniformsBridge.getFormComponent();
  const bridgeProps = uniformsBridge.getFormProps({ fields, model, onChange, ...passthrough });

  const injectedChildren = injectFormBridge(children, uniformsBridge);
  return (
    <AutoForm {...bridgeProps} > {injectedChildren} </AutoForm>
  );
};

Form.propTypes = {
  fields: React.PropTypes.object,
  model: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

Form.defaultProps = {
  onChange: emptyFunction,
  model: {},
  fields: [],
};


export default Form;
