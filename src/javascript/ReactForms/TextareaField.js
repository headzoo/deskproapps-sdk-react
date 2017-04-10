import React  from 'react';

/**
 * @param {FormBridge} formBridge
 * @param {{}} allprops
 * @return {XML}
 * @constructor
 */
const TextareaField = ({ formBridge, ...allprops }) => {
  const Component = formBridge.getTextareaFieldComponent();
  const props = formBridge.getFieldProps(allprops);

  return (
    <Component {...props} />
  );
};

TextareaField.propTypes = {
  formBridge: React.PropTypes.object
};

export default TextareaField;

