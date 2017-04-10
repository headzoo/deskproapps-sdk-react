import React from 'react';

/**
 * @param {FormBridge} formBridge
 * @param {{}} allprops
 * @return {XML}
 * @constructor
 */
const SelectField = ({ formBridge, ...allprops }) => {
  const Component = formBridge.getSelectFieldComponent();
  const props = formBridge.getFieldProps(allprops);

  return (
    <Component {...props} />
  );
};

SelectField.propTypes = {
  formBridge: React.PropTypes.object,
};

export default SelectField;
