import React          from 'react';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

const dateFormat = value => value && value.toISOString().slice(0, 10);
const dateParse = (timestamp, onChange) => {
  const date = new Date(timestamp);
  if (date.getFullYear() < 10000) {
    onChange(date);
  }
};

const Date_ = ({
    className,
    disabled,
    error,
    errorMessage,
    icon,
    iconLeft,
    iconProps,
    id,
    inputRef,
    label,
    max,
    min,
    name,
    onChange,
    placeholder,
    required,
    showInlineError,
    value,
    ...props
  }) => {
    const mainClassnames = [className];
    if (disabled) {
      mainClassnames.push('disabled');
    }
    if (error) {
      mainClassnames.push('error');
    }
    if (required) {
      mainClassnames.push('required');
    }
    mainClassnames.push('field');

    const inputClassnames = ['ui'];
    if (iconLeft) {
      inputClassnames.push('left');
    }
    if (icon || iconLeft) {
      inputClassnames.push('icon');
    }
    inputClassnames.push('input');

    return (
      <div className={mainClassnames.join(' ')} {...filterDOMProps(props)}>
        {label && (
          <label htmlFor={id}>
            {label}
          </label>
        )}

        <div className={inputClassnames.join(' ')}>
          <input
            disabled={disabled}
            id={id}
            max={dateFormat(max)}
            min={dateFormat(min)}
            name={name}
            onChange={event => dateParse(event.target.valueAsNumber, onChange)}
            placeholder={placeholder}
            ref={inputRef}
            type="date"
            value={dateFormat(value)}
          />

          {(icon || iconLeft) && (
            <i className={`${icon || iconLeft} icon`} {...iconProps} />
          )}
        </div>

        {!!(errorMessage && showInlineError) && (
          <div className="ui red basic pointing label">
            {errorMessage}
          </div>
        )}
      </div>
    );

  }
  ;

Date_.displayName = 'Date';

export const DateField = connectField(Date_);
