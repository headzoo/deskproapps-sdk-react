import { SimpleSchema2Bridge as BaseSimpleSchema2Bridge } from 'uniforms';
import SimpleSchema from 'simpl-schema';

// add our own key
SimpleSchema.extendOptions(['deskpro']);

function filterDeskproProperties(props) {
  if (!props) {
    return props;
  }

  const { deskpro, formBridge, ...allowed } = props;
  return allowed;
}

class SimpleSchema2Bridge extends BaseSimpleSchema2Bridge {

  /**
   * @param {{}} uniformsSchema
   * @return {SimpleSchema2Bridge}
   */
  static fromSchemaJS(uniformsSchema) {
    const schemaObject = new SimpleSchema(uniformsSchema);
    return new SimpleSchema2Bridge(schemaObject);
  }

  /**
   * The deskpro getFieldProps are included by uniforms-react into the set of getFieldProps sent to the final markup elements
   * which is causing react to throw warnings
   *
   * @param {String} name
   * @param {{}} props
   * @return {*}
   */
  getProps(name, props = {}) {
    const baseProps = super.getProps(name, props);
    return filterDeskproProperties(baseProps);
  }
}

export default SimpleSchema2Bridge;
