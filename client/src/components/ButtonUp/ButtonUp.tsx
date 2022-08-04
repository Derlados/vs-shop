import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import './button-up.scss';

const ButtonUp = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('scroll', (e) => {
            setIsOpen(window.scrollY > 500);
        })
    }, []);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <div className={classNames('button-up ccc', {
            'button-up__open': isOpen
        })} onClick={scrollUp}>
            <div className='button-up__arrow'></div>
        </div>
    )
}

export default ButtonUp