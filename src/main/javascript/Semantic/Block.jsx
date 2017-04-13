import React, { PropTypes } from 'react';
import { Header, Button, Container, Divider } from 'semantic-ui-react/src';

const Block = ({ label, children, ...other }) => {

  if (label) {
    return (
      <div className="ui field">
        <label>{label}</label>
        <div>
          { children }
        </div>
      </div>
    );
  }

  return (
    <div className="ui field" {...other}>
      { children }
    </div>
  );
};

Block.propTypes = {
  label: PropTypes.string
};
export default Block;

