import React from 'react';

/**
 * @param {FormBridge} formBridge
 * @param {{}} allprops
 * @return {XML}
 * @constructor
 */
const RadioField = ({ formBridge, ...allprops }) => {
  const Component = formBridge.getRadioFieldComponent();
  const props = formBridge.getFieldProps(allprops);

  return (
    <Component {...props} />
  );
};

RadioField.propTypes = {
  formBridge: React.PropTypes.object,
};

export default RadioField;
