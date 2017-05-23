import React from 'react';
import { BaseField as UniformsBaseField } from 'uniforms';
import FormChildContextTypes from './FormChildContextTypes';

class BaseField extends UniformsBaseField {

  static contextTypes = FormChildContextTypes;
  static childContextTypes = FormChildContextTypes;

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
