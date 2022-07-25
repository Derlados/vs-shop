import React, { ChangeEvent, FC, useEffect } from 'react';
import './checkbox.scss';

interface CheckboxProps {
    className?: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: FC<CheckboxProps> = ({ className = '', checked, onChange }) => {

    return (
        <label className={`${className} checkbox  rcc`}>
            <input className='checkbox__input' type="checkbox" checked={checked} onChange={onChange} />
            <span className='checkbox__checkmark'></span>
        </label>
    )
}

export default Checkbox