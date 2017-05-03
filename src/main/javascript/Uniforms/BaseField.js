import React from 'react';
import { BaseField as UniformsBaseField } from 'uniforms';
import isEqual     from 'lodash.isequal';
import FormChildContextTypes from './FormChildContextTypes';

const checkFieldDefinitionEquality = (existingDef, newDef) => {

  if (! isEqual(existingDef.allowedValues, newDef.allowedValues)) {
    return false;
  }

  if (! isEqual(existingDef.optional, newDef.optional)) {
    return false;
  }

  if (! isEqual(existingDef.uniforms.placeholder, newDef.uniforms.placeholder)) {
    return false;
  }

  if (! isEqual(existingDef.uniforms.label, newDef.uniforms.label)) {
    return false;
  }

  return true;
};

class BaseField extends UniformsBaseField {

  static contextTypes = FormChildContextTypes;
  static childContextTypes = FormChildContextTypes;

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    // there is an unidentified bug causing updates in many situations where it is not needed
    const shouldUpdate =  super.shouldComponentUpdate(...arguments);
    if (! shouldUpdate) {
      return false;
    }

    // if the parent decides we must updated but this schema has not changed do not update
    const newSchema = this.context.uniforms.schema !== nextContext.uniforms.schema;
    if (! newSchema) {
      return false;
    }


    // a new schema has been enforced, we must check if the field's definition has changed
    // should we assume the field names will not change ?
    const newName = nextProps.name;
    const newDefinition = nextContext.uniforms.schema.getField(newName);

    const name = this.props.name;
    const definition = this.context.uniforms.schema.getField(name);
    const fieldHasSameDefinition = checkFieldDefinitionEquality(definition, newDefinition);

    if (fieldHasSameDefinition) {
      return false;
    }
    return true;
  }

  getChildContext() {
    const baseContext = super.getChildContext();
    return { deskpro: this.context.deskpro, ...baseContext };
  }

  getFieldProps(name, options) {
    const baseProps = super.getFieldProps(name, options);
    return { ...baseProps, formBridge: this.context.deskpro.formBridge };
  }
}

export default BaseField;
