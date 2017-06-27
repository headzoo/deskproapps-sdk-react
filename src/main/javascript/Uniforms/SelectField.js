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

const renderSelect = ({
    allowedValues,
    disabled,
    groups,
    id,
    inputRef,
    label,
    name,
    onChange,
    options,
    placeholder,
    required,
    transform,
    value
  }) => {
    //build options list
    let optionsList;
    if (!groups) { // only options
      optionsList = allowedValues.map(value =>
        <option key={value} value={value}>
          {transform ? transform(value) : value}
        </option>
      );
    } else { // only groups
      optionsList = options().reduce((parentGroups, option) => {
        const parentGroup = parentGroups.filter((parentGroup) => option.group && parentGroup.label === option.group).pop();
        if (parentGroup) {
          parentGroup.options.push(option);
        }

        return parentGroups;
      }, groups())
      .map((group, index) =>
        <optgroup key={`${id}-group-${group.label}`} label={group.label}>
        {group.options.map(option =>
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )}
      </optgroup>
      );
    }

    return (<select
      disabled={disabled}
      id={id}
      name={name}
      onChange={event => onChange(event.target.value)}
      ref={inputRef}
      value={value}
    >
      {(!!placeholder || !required) && (
        <option value="" disabled={required} hidden={required}>
          {placeholder ? placeholder : label}
        </option>
      )}

      {optionsList}
    </select>)
  }
  ;

const Select = ({
    allowedValues,
    checkboxes,
    className,
    disabled,
    error,
    errorMessage,
    fieldType,
    groups,
    id,
    inputRef,
    label,
    name,
    onChange,
    options,
    placeholder,
    required,
    showInlineError,
    transform,
    value,
    ...props
  }) => {
  return(
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
        : renderSelect    ({allowedValues, options, disabled, groups, id, name, onChange, transform, value, inputRef, label, placeholder, required})
      }
      {/* eslint-enable */}

      {!!(errorMessage && showInlineError) && (
        <div className="ui red basic pointing label">
          {errorMessage}
        </div>
      )}
    </div>);
  }
  ;

//export default connectField(Select);
export const SelectField = connectField(Select);
