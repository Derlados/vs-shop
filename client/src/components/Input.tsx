import React, { FC } from 'react';
import '../styles/components/input.scss';

interface InputProps {
    className?: string;
    hint: string;
    value: string;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({ className = '', value, hint, onChange }) => {
    return (
        <div className={`${className} input clc`}>
            <div className='input__hint'>{hint}</div>
            <input className='input__field' onChange={onChange} value={value} />
        </div>
    )
}

export default Input