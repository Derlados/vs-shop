
import { validate } from 'class-validator';
import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import SmallLoader from '../../lib/SmallLoader/SmallLoader';
import shop from '../../store/shop';
import { IMail } from '../../types/IMail';
import { REGEX } from '../../values/regex';
import './contacts.scss';

interface LocalStore {
    mail: IMail;
    isValidForm: boolean;
    isLoading: boolean;
    isLoadedSuccessful: boolean;
}

const Contacts = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        mail: {
            name: '',
            email: '',
            subject: '',
            message: ''
        },
        isValidForm: true,
        isLoading: false,
        isLoadedSuccessful: false,
    }))

    const phones = ['0(1234) 567 89012', '0(987) 567 890']
    const emails = ['info@demo.com', 'yourname@domain.com']

    const trySendMessage = async () => {
        if (localStore.isLoading || localStore.isLoadedSuccessful) {
            return;
        }

        if (!validate()) {
            localStore.isValidForm = false;
            return;
        }

        localStore.isLoading = true;
        const success = await shop.sendMail(localStore.mail);
        if (success) {
            localStore.isLoadedSuccessful = true;
        }
        localStore.isLoading = false;
    }

    const validate = () => {
        const { name, email, subject, message } = localStore.mail;
        return name !== '' && REGEX.EMAIL_REGEX.test(email) && email !== '' && subject !== '' && message !== '';
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
                        'contacts__input_invalid': !localStore.isValidForm && localStore.mail.name === ''
                    })} placeholder={'Ім\'я *'} value={localStore.mail.name} onChange={(v) => localStore.mail.name = v.target.value} />
                    <input className={classNames('contacts__input', {
                        'contacts__input_invalid': !localStore.isValidForm && !REGEX.EMAIL_REGEX.test(localStore.mail.email)
                    })} placeholder='Електронна пошта *' value={localStore.mail.email} onChange={(v) => localStore.mail.email = v.target.value} />
                </div>
                <input className={classNames('contacts__input', {
                    'contacts__input_invalid': !localStore.isValidForm && localStore.mail.subject === ''
                })} placeholder='Тема повідомлення *' value={localStore.mail.subject} onChange={(v) => localStore.mail.subject = v.target.value} />
                <textarea className={classNames('contacts__input contacts__input_large', {
                    'contacts__input_invalid': !localStore.isValidForm && localStore.mail.message === ''
                })} placeholder='Текст повідомлення *' value={localStore.mail.message} onChange={(v) => localStore.mail.message = v.target.value} />
            </div>
            {!localStore.isLoadedSuccessful ?
                <div className='contacts__form-btn ccc' onClick={trySendMessage}>
                    {!localStore.isLoading ?
                        <div className='contacts__form-btn-text'>Відправити</div>
                        :
                        <SmallLoader className='contacts__loader' />
                    }
                </div>
                :
                <div className='contacts__success'>Відправлено успішно ✓</div>
            }

        </div>
    )
});

export default Contacts