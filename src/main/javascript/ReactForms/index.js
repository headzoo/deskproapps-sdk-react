import { default as FormFields } from './FormFields';
import * as FieldTypesLocal from './FieldTypes';

export Form from './Form';
export const Fields = FormFields;
export const FieldTypes = {
    Checkbox: FieldTypesLocal.Checkbox,
    Date: FieldTypesLocal.Date,
    Radio: FieldTypesLocal.Radio,
    Select: FieldTypesLocal.Select,
    Text: FieldTypesLocal.Text,
    Textarea: FieldTypesLocal.Textarea,
    isType: FieldTypesLocal.isType
};
