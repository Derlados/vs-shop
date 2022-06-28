import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/notFound/not-found.scss';

const NotFound404 = () => {
    return (
        <div className='not-found ccc'>
            <div className='not-found__404'>404</div>
            <div className='not-found__text not-found__text_large'>Щось пішло не так...</div>
            <div className='not-found__text'>Неправильно набрано адресу або такої сторінки на сайті більше не існує.</div>
            <NavLink className='not-found__button rcc' to='/home'>
                <div className='not-found__button-text'>До головної</div>
                <div className='not-found__button-icon'></div>
            </NavLink>
        </div>
    )
}

export default NotFound404