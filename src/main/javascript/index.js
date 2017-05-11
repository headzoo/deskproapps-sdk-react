import { FieldTypes, Form as FormLocal, Fields } from './ReactForms';
import * as Semantic from './Semantic';

export const Form = {
  Form: FormLocal,
  Fields: Fields,
  FieldTypes: {
    Checkbox: FieldTypes.Checkbox,
    Date: FieldTypes.Date,
    Radio: FieldTypes.Radio,
    Select: FieldTypes.Select,
    Text: FieldTypes.Text,
    Textarea: FieldTypes.Textarea,
    isType: FieldTypes.isType,
  }
};

export const Layout = {
  Block : Semantic.Block,
  Section: Semantic.Section,
  Button: Semantic.Button
};

export DeskproAppContainer from './React/DeskproAppContainer'
export { createApp } from '@deskproapps/deskproapps-sdk-core';
