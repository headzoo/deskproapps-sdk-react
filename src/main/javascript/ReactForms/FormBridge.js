class FormBridge {

  getFormFieldsComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };

  getFormFieldsProps = (props) => {
    throw new Error('Must be implemented in a subclass');
  };

  getFormComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };

  getFormProps = (props) => {
    throw new Error('Must be implemented in a subclass');
  };

  getFieldProps = (props) => {
    throw new Error('Must be implemented in a subclass');
  };

  getRadioFieldComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };

  getSelectFieldComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };

  getSubmitFieldComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };

  getTextareaFieldComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };

  getTextFieldComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };

  getCheckboxFieldComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };

  getDateFieldComponent = () => {
    throw new Error('Must be implemented in a subclass');
  };
}

export default FormBridge;
