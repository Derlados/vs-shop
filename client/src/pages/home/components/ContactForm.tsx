import { observer } from 'mobx-react-lite'
import CustomInput from '../../../elements/CustomInput';
import contactsStore from '../../../stores/contacts/contacts.store';
import { REGEX } from '../../../values/regex';

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
              <div className="home__contacts-info-desc">Пн-Пт: 9:00-18:00<br/>Сб-Нд: 10:00-18:00</div>
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
            placeholder={'Ім\'я'}
            value={contactsStore.contactInfo.name}
            invalid={contactsStore.isTriedToSend && contactsStore.contactInfo.name === ''}
          />
          <div className='home__contacts-form__row rlt'>
            <CustomInput
              placeholder={'Email'}
              value={contactsStore.contactInfo.name}
              invalid={contactsStore.isTriedToSend && !REGEX.EMAIL.test(contactsStore.contactInfo.email)}
            />
            <CustomInput
              placeholder={'Номер телефону'}
              value={contactsStore.contactInfo.name}
              invalid={contactsStore.isTriedToSend && !REGEX.PHONE.test(contactsStore.contactInfo.phone)}
            />
          </div>
          <CustomInput
            placeholder={'Тема повідомлення'}
            value={contactsStore.contactInfo.name}
            invalid={contactsStore.isTriedToSend && contactsStore.contactInfo.subject === ''}
          />
          <CustomInput
            placeholder={'Повідомлення'}
            value={contactsStore.contactInfo.name}
            invalid={contactsStore.isTriedToSend && contactsStore.contactInfo.message === ''}
          />
          <div className="contacts__form-btn ccc">
            <div className="contacts__form-btn-text">Відправити</div>
          </div>
        </div>
      </div>
    </div>
  )
});
export default ContactForm