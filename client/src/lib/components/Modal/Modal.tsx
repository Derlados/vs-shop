import React, { FC } from 'react'
import './modal.scss';

interface ModalProps {
    isActive: boolean;
    children: JSX.Element;
    setActive: (flag: boolean) => void;
}

const Modal: FC<ModalProps> = ({ isActive, children, setActive }) => {
    return (
        <div className={isActive ? 'modal  modal_active ccc' : 'modal ccc'} onClick={() => setActive(false)}>
            <div className='modal__content'>
                {children}
            </div>
        </div>
    )
}

export default Modal