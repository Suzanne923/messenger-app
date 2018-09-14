import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

const FormField = ({
  name,
  placeholder,
  component,
  type
}) => (
  <fieldset className="form-group">
    <Field
      name={name}
      placeholder={placeholder}
      component={component}
      type={type}
      className="form-control"
    />
  </fieldset>
);

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  component: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired
};

FormField.defaultProps = { placeholder: '' };

export default FormField;
