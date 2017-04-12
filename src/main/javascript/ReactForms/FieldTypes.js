import { default as Checkbox } from './CheckboxField';
import { default as Date } from './DateField';
import { default as Radio } from './RadioField';
import { default as Select } from './SelectField';
import { default as Textarea } from './TextareaField';
import { default as Text } from './TextField';


const typesList = [ Checkbox, Date, Radio, Select, Textarea, Text ];
function isType(aType) {
  for (const type of typesList) {
    if (aType instanceof type || aType === type) {
      return true;
    }
  }

  return false;
}

export { isType, Checkbox, Date, Radio, Select, Textarea, Text };
