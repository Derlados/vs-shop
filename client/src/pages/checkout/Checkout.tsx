import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import Input from '../../components/Input';
import Selector from '../../components/Selector';
import cart from '../../store/cart';
import '../../styles/checkout/checkout.scss';
import { IOrder } from '../../types/IOrder';

interface LocalStore {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    additiobalInfo: string;
    isEmailValid: boolean;
}

const addresses = [
    'Address 1',
    'Address 2',
    'Address 3',
    'Address 4'
]

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const Checkout = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        firstName: '',
        lastName: '',
        phone: '+38 ',
        email: '',
        city: '',
        address: '',
        additiobalInfo: '',
        isEmailValid: true
    }))

    const onChangeEmail = (email: string) => {
        localStore.isEmailValid = EMAIL_REGEX.test(email)
        localStore.email = email;
    }

    const onChangePhone = (phone: string) => {
        phone = phone.replaceAll(' ', '');
        if (phone.length <= 13) {
            phone = phone.slice(3, phone.length)
            localStore.phone = "+38 ";
            localStore.phone += `${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6, 8)} ${phone.substring(8, phone.length)}`.replace(/\s+$/, '');
        }
    }

    const tryPlaceOrder = () => {
        if (localStore.firstName && localStore.lastName && localStore.phone.length === 17
            && localStore.email && localStore.isEmailValid && localStore.city) {
            const order: IOrder = {
                client: `${localStore.lastName} ${localStore.firstName}`,
                phone: localStore.phone,
                email: localStore.email,
                address: `${localStore.city} ${localStore.address}`,
                additionalInfo: localStore.additiobalInfo,
                totalPrice: cart.totalPrice,
                isComplete: false,
                orderProducts: cart.cartProducts
            }

            //TODO
        }
    }

    return (
        <div className='checkout rlt'>
            <div className='checkout__details clt'>
                <div className='checkout__title'>Billing Details</div>
                <div className='checkout__inputs-row rlc'>
                    <Input className='checkout__input' hint="Ім'я" value={localStore.firstName} onChange={(v) => localStore.firstName = v.target.value} />
                    <Input className='checkout__input' hint="Призвіще" value={localStore.lastName} onChange={(v) => localStore.lastName = v.target.value} />
                </div>
                <div className='checkout__inputs-row rlc'>
                    <Input className='checkout__input' hint='Номер телефону' value={localStore.phone} onChange={(v) => onChangePhone(v.target.value)} />
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': !localStore.isEmailValid
                    })} hint='Електронна пошта' value={localStore.email} onChange={(v) => onChangeEmail(v.target.value)} />
                </div>
                <Input hint='Населений пункт України' value={localStore.city} onChange={(v) => localStore.city = v.target.value} />
                <Selector className='checkout__selector' hint={'Адреса точки видачі'} values={addresses} onChange={(v) => { }} />
                <div className='checkout__additional-info'>
                    <div className='checkout__additional-head'>Additional information</div>
                    <textarea className='checkout__additional-area' placeholder='Notes about your order, e.g. special notes for delivery' onChange={(v) => localStore.additiobalInfo = v.target.value}></textarea>
                </div>
            </div>
            <div className='checkout__order clt'>
                <div className='checkout__title'>Your order</div>
                <div className='checkout__order-container clc'>
                    <div className='checkout__order-head rlc'>
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_large'>Product</div>
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_large'>Total</div>
                    </div>
                    <ul className='checkout__order-product-list'>
                        {cart.cartProducts.map(cp => (
                            <li key={cp.product.id} className='checkout__order-product rlc'>
                                <div className='checkout__order-text'>{cp.product.title} X {cp.count}</div>
                                <div className='checkout__order-text'>{cp.product.price * cp.count} ₴</div>
                            </li>
                        ))}
                    </ul>
                    <div className='checkout__order-delivery rlc'>
                        <div className='checkout__order-text checkout__order-text_bold'>Delivery</div>
                        <div className='checkout__order-text'>Free shipping</div>
                    </div>
                    <div className='checkout__total rlc'>
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_large'>Total</div>
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_primary'>{cart.totalPrice.toFixed(2)} ₴</div>
                    </div>
                </div>
                <div className='checkout__order-accept ccc' onClick={tryPlaceOrder}>PLACE ORDER</div>
            </div>
        </div>
    )
});

export default Checkout