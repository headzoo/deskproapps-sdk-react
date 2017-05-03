import React  from 'react';

/**
 * @param {FormBridge} formBridge
 * @param {{}} allprops
 * @return {XML}
 * @constructor
 */
const TextField = ({ formBridge, ...allprops }) => {
  const Component = formBridge.getTextFieldComponent();
  const props = formBridge.getFieldProps(allprops);

  return ( <Component {...props} /> );
};

TextField.propTypes = {
  formBridge: React.PropTypes.object
};

export default TextField;
