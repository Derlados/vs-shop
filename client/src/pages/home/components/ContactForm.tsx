import { observer } from 'mobx-react-lite'
import CustomInput from '../../../elements/CustomInput';
import contactsStore, { ContactsStoreStatus } from '../../../stores/contacts/contacts.store';
import { REGEX } from '../../../values/regex';
import DobleBounceLoader from '../../../lib/components/DobleBounceLoader/DobleBounceLoader';
import PhoneInput from '../../../lib/components/PhoneInput/PhoneInput';

const ContactForm = observer(() => {
  return (
    <div className='home__contacts-container ccc'>
      <div className="home__contacts-info-container rlt">
        <div className="home__contacts-info">
          <div className="home__contacts-info-block">
            <div className='home__icon home_icon_phone' />
            <div className="home__contacts-info-content">
              <div className="home__contacts-info-title">Номер телефону</div>
              <div className="home__contacts-info-desc">+380 50 123 45 67</div>
            </div>
          </div>
          <div className="home__contacts-info-block">
            <div className='home__icon home_icon_email' />
            <div className="home__contacts-info-content">
              <div className="home__contacts-info-title">Email</div>
              <div className="home__contacts-info-desc">test@gmail.com</div>
            </div>
          </div>
          <div className="home__contacts-info-block">
            <div className='home__icon home_icon_clock' />
            <div className="home__contacts-info-content">
              <div className="home__contacts-info-title">Години праці</div>
              <div className="home__contacts-info-desc">Пн-Пт: 9:00-18:00<br />Сб-Нд: 10:00-18:00</div>
            </div>
          </div>
          <div className="home__contacts-info-block">
            <div className='home__icon home_icon_email' />
            <div className="home__contacts-info-content">
              <div className="home__contacts-info-title">Адреса</div>
              <div className="home__contacts-info-desc">м. Львів, вул. Шевченка 123</div>
            </div>
          </div>
        </div>
        <div className='home__contacts-form'>
          <CustomInput
            name='name'
            placeholder={'Ім\'я'}
            value={contactsStore.contactInfo.name}
            invalid={contactsStore.isTriedToSend && contactsStore.contactInfo.name === ''}
            onChange={(e) => contactsStore.onChangeContactInfo('name', e.target.value)}
          />
          <div className='home__contacts-form__row rlt'>
            <CustomInput
              name='email'
              placeholder={'Email'}
              value={contactsStore.contactInfo.email}
              invalid={contactsStore.isTriedToSend && !REGEX.EMAIL.test(contactsStore.contactInfo.email)}
              onChange={(e) => contactsStore.onChangeContactInfo('email', e.target.value)}
            />
            <PhoneInput
              invalid={contactsStore.isTriedToSend && !REGEX.PHONE.test(contactsStore.contactInfo.phone)}
              value={contactsStore.contactInfo.phone}
              onChange={(e) => contactsStore.onChangeContactInfo('phone', e.target.value)}
            />
          </div>
          <CustomInput
            name='subject'
            placeholder={'Тема повідомлення'}
            value={contactsStore.contactInfo.subject}
            invalid={contactsStore.isTriedToSend && contactsStore.contactInfo.subject === ''}
            onChange={(e) => contactsStore.onChangeContactInfo('subject', e.target.value)}
          />
          <CustomInput
            name='message'
            placeholder={'Повідомлення'}
            value={contactsStore.contactInfo.message}
            invalid={contactsStore.isTriedToSend && contactsStore.contactInfo.message === ''}
            onChange={(e) => contactsStore.onChangeContactInfo('message', e.target.value)}
          />
          <div
            className="contacts__form-btn ccc"
            onClick={() => contactsStore.sendEmail()}
          >
            {contactsStore.status !== ContactsStoreStatus.sending ?
              <div className='contacts__form-btn-text'>Відправити</div>
              :
              <DobleBounceLoader size='medium' />
            }
          </div>
        </div>
      </div>
    </div>
  )
});
export default ContactForm