import React, { ChangeEvent, FC } from 'react'

interface ProductEditorInputProps {
    title: string;
    type?: "number" | "text";
    value: string | number;
    step?: number;
    onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

const ProductEditorInput: FC<ProductEditorInputProps> = ({ title, type, step, value, onChange }) => {
    return (
        <div className='product-editor__input-wrap rlc'>
            <div className='admin-general__input-title'>{title}</div>
            <input
                className='admin-general__input'
                type={type}
                min={0}
                step={step}
                onWheel={(e) => e.currentTarget.blur()}
                value={value}
                onChange={onChange} />
        </div>
    )
}

export default ProductEditorInput