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
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({ className = '', name, mask, placeholder = '', value, hint, onChange }) => {

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
        </div>
    )
}

export default Input