import { LongTextField as BaseField } from 'uniforms-semantic';
import isEqual from 'lodash.isequal';

const checkFieldDefinitionEquality = (existingDef, newDef) => {

  if (! isEqual(existingDef.allowedValues, newDef.allowedValues)) {
    return false;
  }

  if (! isEqual(existingDef.optional, newDef.optional)) {
    return false;
  }

  if (! isEqual(existingDef.uniforms.placeholder, newDef.uniforms.placeholder)) {
    return false;
  }

  if (! isEqual(existingDef.uniforms.label, newDef.uniforms.label)) {
    return false;
  }

  return true;
};

const shouldUpdateOnSchemaChanges = (name, schema, newName, newSchema) =>
{
  if (schema === newSchema) {
    return false;
  }

  // a new schema has been enforced, we must check if the field's definition has changed
  // should we assume the field names will not change ?

  const definition = schema.getField(name);
  const newDefinition = schema.getField(newName);

  return !checkFieldDefinitionEquality(definition, newDefinition);
};

export class TextareaField extends BaseField
{
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    // there is an unidentified bug causing updates in many situations where it is not needed
    const shouldUpdate =  super.shouldComponentUpdate(...arguments);
    if (! shouldUpdate) {
      return false;
    }

    return shouldUpdateOnSchemaChanges(this.props.name, this.context.uniforms.schema, nextProps.name, nextContext.uniforms.schema);
  }

}


