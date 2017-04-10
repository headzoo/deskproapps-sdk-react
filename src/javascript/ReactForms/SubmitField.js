import React from 'react';

/**
 * @param {FormBridge} formBridge
 * @param {{}} allprops
 * @return {XML}
 * @constructor
 */
const SubmitField = ({ formBridge, ...allprops }) => {
  const Component = formBridge.getSubmitFieldComponent();
  const props = formBridge.getFieldProps(allprops);

  return (
    <Component {...props} />
  );
};

SubmitField.propTypes = {
  formBridge: React.PropTypes.object,
};

export default SubmitField;
