import classNames from 'classnames'
import React, { FC } from 'react'
import './custom-input.scss'

interface ICustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
  error?: string;
}

const CustomInput: FC<ICustomInputProps> = (props) => {
  return (
    <input
      className={classNames('custom-input', {
        'custom-input_invalid': props.invalid
      }, props.className)}
      {...props}
    />
  )
}

export default CustomInput