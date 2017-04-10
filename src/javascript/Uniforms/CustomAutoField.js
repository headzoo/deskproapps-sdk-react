import React from 'react';
import connectField from 'uniforms/connectField';

import DateField from '../ReactForms/DateField';
import RadioField from '../ReactForms/RadioField';
import SelectField from '../ReactForms/SelectField';
import TextField from '../ReactForms/TextField';
import * as FieldTypes from '../ReactForms/FieldTypes';

import BaseField from './BaseField';

function determineAutoComponentFromProps(props) {
  if (props.allowedValues) {
    if (props.checkboxes && props.fieldType !== Array) {
      return RadioField;
    }
    return SelectField;
  }

  switch (props.fieldType) {
    case Date:
      return DateField;
    case Array:
      return SelectField; // return = ListField; break;
    case String:
      return TextField;
    case Number:
      return TextField; // case Number:  getFieldProps.component = NumField;  break;
    case Boolean:
      return RadioField;
    default:
      throw new Error('Unsupported field type: %s', props.fieldType.toString());
  }
}

function determineDeskproComponent(props) {
  if (!props) {
    return null;
  }

  const { component } = props;
  if (component && FieldTypes.isType(component)) {
    return component;
  }
  return null;
}

const CustomAutoField = (props) => {
  const { field, formBridge, ...passthroughProps } = props;
  const { deskpro } = field;
  const Component = determineDeskproComponent(deskpro) || determineAutoComponentFromProps(passthroughProps);

  return (
    <Component formBridge={formBridge} field={field} {...passthroughProps} />
  );
};

CustomAutoField.propTypes = {
  deskpro: React.PropTypes.object,
  field: React.PropTypes.object
};

export default connectField(CustomAutoField, {
  baseField: BaseField,
  ensureValue: false,
  includeInChain: false,
  initialValue: false
});
