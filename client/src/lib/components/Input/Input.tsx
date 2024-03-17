import React, { FC } from 'react';
import InputMask from "react-input-mask";
import './input.scss';


interface InputProps {
  className?: string;
  mask?: string;
  name: string;
  placeholder?: string;
  hint: string;
  value: string;
  error?: string;
  showErrors?: boolean;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({ className = '', name, mask, placeholder = '', value, hint, error, showErrors = false, onChange }) => {

  return (
    <div className={`${className} input clc`}>
      <div className='input__hint'>{hint}</div>
      {mask ?
        <InputMask
          name={name}
          className='input__field'
          mask={mask}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={(e) => e.preventDefault()}
        />
        :
        <input className='input__field' name={name} placeholder={placeholder} onChange={onChange} value={value} />
      }
      {(error && showErrors) && <div className='input__error'>{error}</div>}
    </div>
  )
}

export default Input