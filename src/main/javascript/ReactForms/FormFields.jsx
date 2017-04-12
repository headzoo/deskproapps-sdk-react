import React from 'react';

/**
 * @param {FormBridge} formBridge
 * @param fields
 * @param otherProps
 * @return {XML}
 * @constructor
 */
const FormFields = ({ formBridge, fields, ...otherProps }) => {

  const Component = formBridge.getFormFieldsComponent();
  const props = formBridge.getFormFieldsProps({ fields, ...otherProps });

  return (
    <Component {...props} />
  );
};

FormFields.propTypes = {
  formBridge: React.PropTypes.object,
  fields: React.PropTypes.array,
};

export default FormFields;

