import React from 'react';

/**
 * @param {FormBridge} formBridge
 * @param {{}} allprops
 * @return {XML}
 * @constructor
 */
const CheckboxField = ({ formBridge, ...allprops }) => {
  const Component = formBridge.getCheckboxFieldComponent();
  const props = formBridge.getFieldProps(allprops);

  return (
    <Component {...props} />
  );
};

CheckboxField.propTypes = {
  formBridge: React.PropTypes.object,
};

export default CheckboxField;
