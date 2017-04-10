import CheckboxField from './CheckboxField';
import DateField from './DateField';
import RadioField from './RadioField';
import SelectField from './SelectField';
import TextareaField from './TextareaField';
import TextField from './TextField';


const typesList = [
  CheckboxField,
  DateField,
  RadioField,
  SelectField,
  TextareaField,
  TextField
];

function isType(aType) {
  for (const type of typesList) {
    if (aType instanceof type || aType === type) {
      return true;
    }
  }

  return false;
}

export { isType };
