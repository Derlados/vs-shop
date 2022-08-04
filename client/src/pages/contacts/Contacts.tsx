
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react'
import Input from '../../lib/Input/Input';
import './contacts.scss';

interface LocalStore {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const Contacts = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        name: '',
        email: '',
        subject: '',
        message: ''
    }))

    const phones = ['0(1234) 567 89012', '0(987) 567 890']
    const emails = ['info@demo.com', 'yourname@domain.com']

    return (
        <div className='contacts'>
            <div className='contacts__title'>CONNECT WITH US</div>
            <div className='contacts__subtitle'>Sample text. Click to select the text box. Click again or double click to start editing the text.</div>
            <div className='contacts__row'>
                <div className='contacts__row-item ccc'>
                    <div className='contacts__icon ccc'></div>
                    <div className='contacts__row-item-title'>NUMBER PHONE</div>
                    <ul className='contacts__list clc'>
                        {phones.map((phone, index) => (
                            <li className='contacts__list-item'>Phone {index}: {phone}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='contacts__row'>
                <div className='contacts__row-item ccc'>
                    <div className='contacts__icon contacts__email ccc'></div>
                    <div className='contacts__title'>ADDRESS EMAIL</div>
                    <ul className='contacts__list clc'>
                        {emails.map(email => (
                            <li className='contacts__list-item'>{email}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='contacts__form'>
                <div className='rlc'>
                    <input className='contacts__input' placeholder={'Ім\'я'} value={localStore.name} onChange={(v) => localStore.name = v.target.value} />
                    <input className='contacts__input' placeholder='Електронна пошта' value={localStore.email} onChange={(v) => localStore.email = v.target.value} />
                </div>
                <input className='contacts__input' placeholder='Тема повідомлення' value={localStore.subject} onChange={(v) => localStore.subject = v.target.value} />
                <textarea className='contacts__input contacts__input_large' placeholder='Текст повідомлення' value={localStore.message} onChange={(v) => localStore.message = v.target.value} />
            </div>
        </div>
    )
});

export default Contacts