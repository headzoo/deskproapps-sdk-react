import React, { PropTypes } from 'react';
import { Header, Divider, Segment } from 'semantic-ui-react/src';

const Section = ({ children, title, ...other }) => {

  const style = {
    borderColor: 'white'
  };

  return (
    <Segment vertical style={style} className="form">
      <Header dividing size="tiny">{title}</Header>
      { children }
    </Segment>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired
};
export default Section;

