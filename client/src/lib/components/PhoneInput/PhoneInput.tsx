import React, { FC } from 'react'
import Input from '../Input/Input'
import classNames from 'classnames';
import CustomInput from '../../../elements/CustomInput';

interface PhoneInputProps {
  invalid: boolean;
  value: string;
  hint?: string;
  error?: string;
  showErrors?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const phoneMask = '+38 999 999 99 99';

const PhoneInput: FC<PhoneInputProps> = ({
  invalid,
  value,
  hint,
  error,
  showErrors = false,
  onChange,
}) => {
  return (
    <Input className={classNames('checkout__input', {
      'checkout__input_invalid': invalid,
    })}
      name="telephone"
      mask={phoneMask}
      placeholder="+38 ___ ___ __ __"
      hint={hint}
      value={value}
      onChange={onChange}
      error={error}
      showErrors={showErrors}
    />
  )
}

export default PhoneInput