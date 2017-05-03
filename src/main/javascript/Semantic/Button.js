import React, { PropTypes } from 'react';
import { Button as SemanticButton } from 'semantic-ui-react/src';

const Button = ({ onClick, children, primary }) => {

  const props = {};
  if (primary) {
    props.primary = true;
  } else {
    props.basic = true;
  }

  return (<SemanticButton {...props} fluid onClick={onClick}>{children}</SemanticButton>)

};

Button.propTypes = {
  onClick: PropTypes.func.required,
  primary: PropTypes.boolean
};
export default Button;

