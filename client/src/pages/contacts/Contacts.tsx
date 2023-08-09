
import { validate } from 'class-validator';
import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import SmallLoader from '../../lib/components/SmallLoader/SmallLoader';
import conactsStore, { ContactsStoreStatus } from '../../store/contacts/contacts.store';
import shop from '../../store/shop';

import { REGEX } from '../../values/regex';
import './contacts.scss';

const Contacts = observer(() => {
    const phones = ['0(1234) 567 89012', '0(987) 567 890']
    const emails = ['info@demo.com', 'yourname@domain.com']

    const trySendMessage = () => {
        conactsStore.sendMail();
    }

    const onNameChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        conactsStore.onNameChange(v.target.value);
    }

    const onEmailChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        conactsStore.onEmailChange(v.target.value);
    }

    const onSubjectChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        conactsStore.onSubjectChange(v.target.value);
    }

    const onMessageChange = (v: React.ChangeEvent<HTMLTextAreaElement>) => {
        conactsStore.onMessageChange(v.target.value);
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
                        В               </ul>
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
                        'contacts__input_invalid': conactsStore.isTriedToSend && conactsStore.name === ''
                    })} placeholder={'Ім\'я *'} value={conactsStore.name} onChange={onNameChange} />
                    <input className={classNames('contacts__input', {
                        'contacts__input_invalid': conactsStore.isTriedToSend && !REGEX.EMAIL_REGEX.test(conactsStore.email)
                    })} placeholder='Електронна пошта *' value={conactsStore.email} onChange={onEmailChange} />
                </div>
                <input className={classNames('contacts__input', {
                    'contacts__input_invalid': conactsStore.isTriedToSend && conactsStore.subject === ''
                })} placeholder='Тема повідомлення *' value={conactsStore.subject} onChange={onSubjectChange} />
                <textarea className={classNames('contacts__input contacts__input_large', {
                    'contacts__input_invalid': conactsStore.isTriedToSend && conactsStore.message === ''
                })} placeholder='Текст повідомлення *' value={conactsStore.message} onChange={onMessageChange} />
            </div>
            {conactsStore.status !== ContactsStoreStatus.success ?
                <div className='contacts__form-btn ccc' onClick={trySendMessage}>
                    {conactsStore.status !== ContactsStoreStatus.sending ?
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