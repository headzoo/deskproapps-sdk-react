import React          from 'react';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

const classnames = (...args) => {
  const argsStack = args.reverse();
  const classnamesList = [];

  while (argsStack.length) {
    const arg = argsStack.pop();
    if (!arg) { continue; } // undefined, null, empty string

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classnamesList.push(arg);
    } else if (argType === 'object') {
      Object.keys(arg)
        .reverse()
        .filter(key => !!arg[key])
        .forEach(value => argsStack.push(value))
      ;
    }
  }

  return classnamesList.length ? classnamesList.join(' ') : '';
};

const xor = (item, array) => {
    const index = array.indexOf(item);
    if (index === -1) {
        return array.concat([item]);
    }

    return array.slice(0, index).concat(array.slice(index + 1));
};

const renderCheckboxes = ({allowedValues, disabled, fieldType, id, name, onChange, transform, value}) =>
    allowedValues.map(item =>
        <div className="field" key={item}>
            <div className="ui checkbox">
                <input
                    checked={fieldType === Array ? value.includes(item) : value === item}
                    disabled={disabled}
                    id={`${id}-${item}`}
                    name={name}
                    onChange={() => onChange(fieldType === Array ? xor(item, value) : item)}
                    type="checkbox"
                />

                <label htmlFor={`${id}-${item}`}>
                    {transform ? transform(item) : item}
                </label>
            </div>
        </div>
    )
;

const handleOnChange = (onChange, allowedValues, options, selectedValue) =>
{
  let found = false;
  let index;
  for (let i = 0, len = options.length; i < len && !found ; i++) {
        found = options[i].value === selectedValue;
        index = i;
  }

  if (found && index < allowedValues.length ) {
      onChange(allowedValues[index]);
  }
};


const renderSelect = ({
    allowedValues,
    disabled,
    id,
    inputRef,
    label,
    name,
    onChange,
    placeholder,
    required,
    transform,
    value
}) => {
    console.log('rendering select with value ', value);
      const options = allowedValues.map(value => mapValueToSelectOption(value, transform));

      return (<select
        disabled={disabled}
        id={id}
        name={name}
        onChange={event => handleOnChange(onChange, allowedValues, options, event.target.value)}
        ref={inputRef}
        value={ mapValueToSelectOption(value, transform).value }
      >
        {(!!placeholder || !required) && (
          <option value="" disabled={required} hidden={required}>
            {placeholder ? placeholder : label}
          </option>
        )}

        {
          options.map(props => <option key={props.key} value={props.value}> {props.label} </option>)
        }
      </select>
      );
  }
;

const mapValueToSelectOption = (originalValue, transform) => {

    if (!originalValue) {
        return {key: null, value: null, text: null}
    }

    if (!transform) {
        return {key: originalValue, value: originalValue, label: originalValue};
    }

    const transformedValue = transform(originalValue);
    if (typeof transformedValue !== 'object') { //transform returns a primitive
      return {key: transformedValue, value: transformedValue, label: transformedValue};
    }

    const { value, label, ...rest } = transformedValue;
    return { key: value, value, label };
};

const Select = ({
    allowedValues,
    checkboxes,
    className,
    disabled,
    error,
    errorMessage,
    fieldType,
    id,
    inputRef,
    label,
    name,
    onChange,
    placeholder,
    required,
    showInlineError,
    transform,
    value,
    ...props
}) => {
  console.log('select starts with value ', value, props, fieldType);

  return (
    <div className={classnames({disabled, error, required}, className, 'field')} {...filterDOMProps(props)}>
        {label && (
            <label htmlFor={id}>
                {label}
            </label>
        )}

        {/* TODO: Better handling of these props. */}
        {/* eslint-disable max-len */}
        {checkboxes || fieldType === Array
            ? renderCheckboxes({allowedValues, disabled, id, name, onChange, transform, value, fieldType})
            : renderSelect    ({allowedValues, disabled, id, name, onChange, transform, value, inputRef, label, placeholder, required})
        }
        {/* eslint-enable */}

        {!!(errorMessage && showInlineError) && (
            <div className="ui red basic pointing label">
                {errorMessage}
            </div>
        )}
    </div>
  )};
;

//export default connectField(Select);
export const SelectField = connectField(Select);
