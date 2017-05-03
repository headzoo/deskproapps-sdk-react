import { FieldTypes, Form as FormLocal, Fields } from './ReactForms';
import * as Semantic from './Semantic';
import * as UICommandLocal from './UICommand';

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

export const UICommand = {
    EnableCommand: UICommandLocal.EnableCommand,
    OptionsCommand: UICommandLocal.OptionsCommand,
    fromString: UICommandLocal.fromString,
    commandChain: UICommandLocal.commandChain,
};

export connect from './React/connect';
