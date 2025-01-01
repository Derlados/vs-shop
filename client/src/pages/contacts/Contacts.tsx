
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import SmallLoader from '../../lib/components/SmallLoader/SmallLoader';
import contactsStore, { ContactsStoreStatus } from '../../stores/contacts/contacts.store';
import { REGEX } from '../../values/regex';
import './contacts.scss';
import { IMail } from '../../types/shop/IMail';

const Contacts = observer(() => {
  const phones = ['0(1234) 567 89012', '0(987) 567 890']
  const emails = ['info@demo.com', 'yourname@domain.com']

  const trySendMessage = () => {
    contactsStore.sendMail();
  }

  const onChangeField = (field: keyof IMail, value: string) => {
    contactsStore.onChangeContactInfo(field, value);
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
          <div className='contacts__row-item-title'>Номера телефонів</div>
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
          <div className='contacts__row-item-title'>Email</div>
          <ul className='contacts__list ccc'>
            {emails.map(email => (
              <li key={email} className='contacts__list-item'>{email}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className='contacts__form'>
        <div className='contacts__input-row rlc'>
          <input 
            className={classNames('contacts__input', {
              'contacts__input_invalid': contactsStore.isTriedToSend && contactsStore.contactInfo.name === ''
            })} 
            placeholder={'Ім\'я *'}
            value={contactsStore.contactInfo.name}
            onChange={(e) => onChangeField('name', e.target.value)}
          />
          <input className={classNames('contacts__input', {
            'contacts__input_invalid': contactsStore.isTriedToSend && !REGEX.EMAIL.test(contactsStore.contactInfo.email)
          })} placeholder='Електронна пошта *' value={contactsStore.contactInfo.email} onChange={(e) => onChangeField('email', e.target.value)} />
        </div>
        <input className={classNames('contacts__input', {
          'contacts__input_invalid': contactsStore.isTriedToSend && contactsStore.contactInfo.subject === ''
        })} placeholder='Тема повідомлення *' value={contactsStore.contactInfo.subject} onChange={(e) => onChangeField('subject', e.target.value)} />
        <textarea className={classNames('contacts__input contacts__input_large', {
          'contacts__input_invalid': contactsStore.isTriedToSend && contactsStore.contactInfo.message === ''
        })} placeholder='Текст повідомлення *' value={contactsStore.contactInfo.message} onChange={(e) => onChangeField('message', e.target.value)} />
      </div>
      {contactsStore.status !== ContactsStoreStatus.success ?
        <div className='contacts__form-btn ccc' onClick={trySendMessage}>
          {contactsStore.status !== ContactsStoreStatus.sending ?
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