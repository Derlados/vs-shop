import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/users/auth.service';
import user from '../../store/user';
import './auth.scss';

interface LocalStore {
    email: string;
    password: string;
    emailValid: boolean;
    passwordValid: boolean;
}

const Auth = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        email: '',
        password: '',
        emailValid: true,
        passwordValid: true
    }));
    const navigate = useNavigate();

    const tryLogin = async () => {
        if (localStore.email && localStore.password) {
            const { accessToken, user: userInfo } = (await authService.login(localStore.email, localStore.password));
            if (accessToken) {
                user.setToken(accessToken);
                user.setUserInfo(userInfo);
                navigate("../home");
            }
        } else {
            localStore.emailValid = localStore.email !== '';
            localStore.passwordValid = localStore.password !== '';
        }
    }

    const OnEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        localStore.email = e.target.value;
        localStore.emailValid = true;
    }

    const OnPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        localStore.password = e.target.value;
        localStore.passwordValid = true;
    }

    return (
        <div className='auth ccc'>
            <div className='auth__container ccc'>
                <img className='auth__logo' alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' />
                <input className={classNames('auth__input', { 'auth__input_invalid': !localStore.emailValid })} type="email" placeholder='username' onChange={OnEmailChange} />
                <input className={classNames('auth__input', { 'auth__input_invalid': !localStore.passwordValid })} type="password" placeholder='password' onChange={OnPasswordChange} />
                {authService.getError() && <div className='auth__error'>* Неверный email или пароль</div>}
                <div className='auth__login' onClick={tryLogin}>Login</div>
            </div>
        </div>
    )
});

export default Auth