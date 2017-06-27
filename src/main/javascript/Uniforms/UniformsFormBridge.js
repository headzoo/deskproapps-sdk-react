import React from 'react';
import merge from 'lodash.merge';

import { BoolField, RadioField, SubmitField, AutoFields } from 'uniforms-semantic';
import {  TextField } from './TextField';
import { TextareaField } from './TextareaField';
import { DateField } from './DateField';
import { SelectField } from './SelectField';

import FormBridge from '../ReactForms/FormBridge';

import CustomAutoField from './CustomAutoField';
import AutoForm from './AutoForm';
import SimpleSchema2Bridge from './SimpleSchema2Bridge';
import ChangeEventAccumulator from './ChangeEventAccumulator';

const bridgeField = (bridge, UniformsField) => (allprops) => {
  const props = bridge.getFieldProps(allprops);
  return (
    <UniformsField {...props} updateOnSchemaChanges={false} />
  );
};

class UniformsFormBridge extends FormBridge {

  static createSchemaBridge(fields) {
    const uniformsSchema = UniformsFormBridge.parseFieldDefinitions(fields);
    return SimpleSchema2Bridge.fromSchemaJS(uniformsSchema);
  }

  /**
   * @param {{}} fields
   * @return {{}}
   */
  static parseFieldDefinitions = (fields) => {
    const uniformsSchema = {};
    const fieldNames = Object.keys(fields);

    if (fieldNames.length === 0) {
      throw new Error('Fields configuration can not be empty');
    }

    for (const fieldName of fieldNames) {
      const field = fields[fieldName];

      // TODO apply schema validator
      const { ui, schema, ...others } = field;
      const { component, ...uniforms } = ui || {};
      let uniformsFieldSchema = null;

      if (Object.keys(others || {}).length === 0 && schema) { // field has a ui definition and a schema definition
        uniformsFieldSchema = merge({}, schema);

        if (uniforms) {
          merge(uniformsFieldSchema, merge({ uniforms: merge({}, uniforms) }));
        }

        if (component) {
          merge(uniformsFieldSchema, { deskpro: { component } });
        }
      } else if (!ui && !schema && Object.keys(others || {}).length > 0) { // field definition is just a schema definition
        uniformsFieldSchema = merge({}, others);
      }

      if (!uniformsSchema) {
        throw new Error(`Unknown field definition for field: ${fieldName}`);
      }

      uniformsSchema[fieldName] = uniformsFieldSchema;
    }

    return uniformsSchema;
  };

  /**
   * @param props
   * @return {{}}
   */
  getPassthroughFieldProps =(props) => {
    // noinspection Eslint
    const { placeholder, field, component, ...allowed } = props;
    return allowed;
  };

  getInjectedFieldProps = ({ placeholder, field, ...passthrough }) => {
    const actualPlaceholder = (field && field.uniforms && field.uniforms.placeholder) ? field.uniforms.placeholder : placeholder;
    return { placeholder: actualPlaceholder, field };
  };

  /**
   * @param {{}} props
   * @return {{}}
   */
  getFieldProps = (props) => {
    const passthrough = this.getPassthroughFieldProps(props);
    const injected = this.getInjectedFieldProps(props);

    return { ...injected, ...passthrough };
  };

  /**
   * @param {{}} props
   * @return {{}}
   */
  getPassthroughFormProps = (props) => {
    // noinspection Eslint
    const { fields, onChangeModel, onChange, model, autoField, schema, formBridge, ...allowed } = props;
    return allowed;
  };

  /**
   * @param {Array<{}>} fields
   * @param model
   * @param onChange
   * @return {{formBridge: UniformsFormBridge, schema: *, model: (*|{}), onChange: (function(...[*]=): *), onChangeModel: (function(...[*]=): *)}}
   */
  getInjectedFormProps =({ fields, model, onChange }) => {
    const eventAccumulator = new ChangeEventAccumulator();
    const onChangeComposite = (...args) => {
      const accumulatorArgs = [onChange].concat(args);
      eventAccumulator.onChange.call(eventAccumulator, ...accumulatorArgs);
    };
    const schemaBridge = UniformsFormBridge.createSchemaBridge(fields);

    return {
      autoField: CustomAutoField,
      formBridge: this,
      schema: schemaBridge,
      model: model || {},
      onChange: onChangeComposite,
      onChangeModel: onChangeComposite
    };
  };

  /**
   * @param {{}} props
   * @return {{}}
   */
  getFormProps = (props) => {
    const passthrough = this.getPassthroughFormProps(props);
    const injected = this.getInjectedFormProps(props);

    return { ...injected, ...passthrough };
  };

  getFormComponent = () => {
    return AutoForm;
  };

  getFormFieldsComponent = () => AutoFields;

  getFormFieldsProps = ({ fields }) => ({ fields, autoField: CustomAutoField, className: "field", updateOnSchemaChanges: false }); // TODO add classname instead of overwrite

  getRadioFieldComponent = () => bridgeField(this, RadioField);

  getSelectFieldComponent = () => bridgeField(this, SelectField);

  getSubmitFieldComponent = () => bridgeField(this, SubmitField);

  getTextareaFieldComponent = () => TextareaField;

  getTextFieldComponent = () => TextField;

  getCheckboxFieldComponent = () => bridgeField(this, BoolField);

  getDateFieldComponent = () => bridgeField(this, DateField);
}

export default UniformsFormBridge;

