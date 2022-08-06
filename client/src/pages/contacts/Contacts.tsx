
import { validate } from 'class-validator';
import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { REGEX } from '../../values/regex';
import './contacts.scss';

interface LocalStore {
    name: string;
    email: string;
    subject: string;
    message: string;
    isValidForm: boolean;
}

const Contacts = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        name: '',
        email: '',
        subject: '',
        message: '',
        isValidForm: true,
    }))

    const phones = ['0(1234) 567 89012', '0(987) 567 890']
    const emails = ['info@demo.com', 'yourname@domain.com']

    const trySendMessage = () => {
        if (!validate()) {
            localStore.isValidForm = false;
            return;
        }

        //TODO
    }

    const validate = () => {
        return localStore.name !== '' && REGEX.EMAIL_REGEX.test(localStore.email) && localStore.email !== ''
            && localStore.subject !== '' && localStore.message !== ''
    }

    return (
        <div className='contacts ccc'>
            <div className='contacts__title'>Зв'яжіться з нами</div>
            <div className='contacts__subtitle'>Sample text. Click to select the text box. Click again or double click to start editing the text.</div>
            <div className='contacts__row rct'>
                <div className='contacts__row-item ccc'>
                    <div className='contacts__icon-wrapper ccc'>
                        <div className='contacts__icon contacts__icon_phone'></div>
                    </div>
                    <div className='contacts__row-item-title'>NUMBER PHONE</div>
                    <ul className='contacts__list ccc'>
                        {phones.map((phone, index) => (
                            <li key={phone} className='contacts__list-item'>Phone {index}: {phone}</li>
                        ))}
                    </ul>
                </div>
                <div className='contacts__row-item ccc'>
                    <div className='contacts__icon-wrapper ccc'>
                        <div className='contacts__icon contacts__icon_email'></div>
                    </div>
                    <div className='contacts__row-item-title'>ADDRESS EMAIL</div>
                    <ul className='contacts__list ccc'>
                        {emails.map(email => (
                            <li key={email} className='contacts__list-item'>{email}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='contacts__form'>
                <div className='contacts__input-row rlc'>
                    <input className={classNames('contacts__input', {
                        'contacts__input_invalid': !localStore.isValidForm && localStore.name === ''
                    })} placeholder={'Ім\'я *'} value={localStore.name} onChange={(v) => localStore.name = v.target.value} />
                    <input className={classNames('contacts__input', {
                        'contacts__input_invalid': !localStore.isValidForm && !REGEX.EMAIL_REGEX.test(localStore.email)
                    })} placeholder='Електронна пошта *' value={localStore.email} onChange={(v) => localStore.email = v.target.value} />
                </div>
                <input className={classNames('contacts__input', {
                    'contacts__input_invalid': !localStore.isValidForm && localStore.subject === ''
                })} placeholder='Тема повідомлення *' value={localStore.subject} onChange={(v) => localStore.subject = v.target.value} />
                <textarea className={classNames('contacts__input contacts__input_large', {
                    'contacts__input_invalid': !localStore.isValidForm && localStore.message === ''
                })} placeholder='Текст повідомлення *' value={localStore.message} onChange={(v) => localStore.message = v.target.value} />
            </div>
            <div className='contacts__form-btn ccc' onClick={trySendMessage}>Send message</div>
        </div>
    )
});

export default Contacts