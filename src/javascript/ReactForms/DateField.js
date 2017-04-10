import React from 'react';

/**
 * @param {FormBridge} formBridge
 * @param {{}} allprops
 * @return {XML}
 * @constructor
 */
const DateField = ({ formBridge, ...allprops }) => {
  const Component = formBridge.getDateFieldComponent();
  const props = formBridge.getFieldProps(allprops);

  return (
    <Component {...props} />
  );
};

DateField.propTypes = {
  formBridge: React.PropTypes.object,
};

export default DateField;
