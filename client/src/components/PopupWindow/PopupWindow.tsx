import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './popup-window.scss';

const PopupWindow = () => {
  const [showWindow, setShowWindow] = useState(false);
  const close: string = require("../../assets/images/close.svg").default;
  const contact_us: string = require("../../assets/images/contact_us.svg").default;
  const email: string = require("../../assets/images/email.svg").default;
  const phone: string = require("../../assets/images/phone.svg").default;

  const handleClick = () => setShowWindow(true)

  const closeWindow = () => setShowWindow(false);

  return (
    <div>
      {!showWindow && (
        <button className="popup-window__open-button rcc" onClick={handleClick}>
          Щось шукаєте?
          <span className='popup-window__contact-us' onClick={closeWindow}>
            <img alt='' src={contact_us} />
          </span>
        </button>
      )}
      <div className={`popup-window rlc ${showWindow ? 'popup-window_opened' : 'popup-window_closed'}`}>
        <span className='popup-window__close-button' onClick={closeWindow}>
          <img alt='' src={close} />
        </span>
        <div className="popup-window__blue-bar"></div>
        <div className="popup-window__content ccc">
          <h3 className="popup-window__title ccc">Щось шукаєте?</h3>
          <span className="popup-window__desc ccc">Ви назнайшли що шукали чи у вас є додаткові питання ? Напишіть нам і ми можемо вам допомогти.</span>
          <div className="popup-window__social-icons rcc">
            <a href="">
              <div className="popup-window__social-icon ccc">
                <img className="popup-window__social-icon-img" src={email} alt="email" />
              </div>
            </a>
            <a href="">
              <div className="popup-window__social-icon ccc">
                <img className="popup-window__social-icon-img" src={phone} alt="phone" />
              </div>
            </a>
            <a href="">
              <img className="popup-window__social-icon-img-tg" src={require("../../assets/images/telegram.png")} alt="telegram" />
            </a>
          </div>
          <NavLink to="/contacts">
            <button className="popup-window__contact-button rcc">
              Зв'яжіться з нами
              <span className='popup-window__contact-us' onClick={closeWindow}>
                <img alt='' src={contact_us} />
              </span>
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default PopupWindow;