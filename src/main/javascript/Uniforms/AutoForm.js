import React from 'react';

import { createSchemaBridge } from 'uniforms';
import { AutoForm as UniformsForm } from 'uniforms-semantic';

import { Button } from 'semantic-ui-react/src';
import FormChildContextTypes from './FormChildContextTypes';

class AutoForm extends UniformsForm {

  static childContextTypes = FormChildContextTypes;

  /**
   * There is a bug in uniforms/AutoForm which prevents the validator to update if a new schema is received
   *
   * @param model
   * @param schema
   * @param validate
   * @param validator
   */
  componentWillReceiveProps({ model, schema, validate, validator }) {
    super.componentWillReceiveProps(...arguments);

    if (this.props.schema !== schema) {
      const bridge = createSchemaBridge(schema);
      this.setState({
        bridge,
        validator: bridge.getValidator(validator)
      }, () => {
        if (validate === 'onChange' || validate === 'onChangeAfterSubmit' && this.state.validate) {
          this.onValidate();
        }
      });
    }
  }

  getChildContext() {
    const baseContext = super.getChildContext();
    const { formBridge } = this.props;

    return { deskpro: { formBridge }, ...baseContext };
  }

  render() {
    const { onCancel, onSubmit } = this.props;

    const AutoField = this.props.autoField || this.getAutoField();
    const ErrorsField = this.props.errorsField || this.getErrorsField();

    const { children, ...otherProps } = this.getNativeFormProps();

    if (children) {
      return (
        <form {...otherProps}>
          {children}
          <ErrorsField />
          { this.renderButtons() }
        </form>
      );
    }

    return (
      <form {...otherProps}>
        {this.getChildContextSchema().getSubfields().map(key =>
          <AutoField key={key} name={key} />
        )}

        <ErrorsField />
        { this.renderButtons() }

      </form>
    );
  }

  renderButtons = () => {
    const { onCancel, onSubmit } = this.props;
    const SubmitField = this.props.getSubmitFieldComponent || this.getSubmitField();

    if (onCancel && onSubmit) {
      return (
        <div>
          <SubmitField className="primary" />
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      );
    }

    if (onCancel) {
      return (
        <div>
          <Button basic onClick={onCancel}>Cancel</Button>
        </div>
      );
    }

    if (onSubmit) {
      return (
        <div>
          <SubmitField className="primary" />
        </div>
      );
    }
  };

  getNativeFormProps() {
    const props = super.getNativeFormProps();
    const { onCancel, formBridge, ...otherProps } = props;

    return otherProps;
  }
}

export default AutoForm;
