import React from 'react';
import { PropTypes } from 'react';
import { BaseForm } from 'uniforms';

export default {
  ...BaseForm.childContextTypes,
  deskpro: PropTypes.shape({
    formBridge: PropTypes.object.isRequired
  })
};
