import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import Input from '../../components/Input';
import Selector from '../../components/Selector';
import '../../styles/checkout/checkout.scss';

interface LocalStore {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    city: string;
}

const addresses = [
    'Address 1',
    'Address 2',
    'Address 3',
    'Address 4'
]

const Checkout = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        city: ''
    }))

    return (
        <div className='checkout rlt'>
            <div className='checkout__details clt'>
                <div className='checkout__title'>Billing Details</div>
                <div className='checkout__inputs-row rlc'>
                    <Input className='checkout__input' hint="Ім'я" value={localStore.firstName} onChange={(v) => localStore.firstName = v.target.value} />
                    <Input className='checkout__input' hint="Призвіще" value={localStore.lastName} onChange={(v) => localStore.lastName = v.target.value} />
                </div>
                <div className='checkout__inputs-row rlc'>
                    <Input className='checkout__input' hint='Номер телефону' value={localStore.phone} onChange={(v) => localStore.phone = v.target.value} />
                    <Input className='checkout__input' hint='Електронна пошта' value={localStore.email} onChange={(v) => localStore.email = v.target.value} />
                </div>
                <Input hint='Населений пункт України' value={localStore.city} onChange={(v) => localStore.city = v.target.value} />
                <Selector className='checkout__selector' hint={'Адреса точки видачі'} values={addresses} onChange={() => { }} />
                <div className='checkout__additional-info'>
                    <div className='checkout__additional-head'>Additional information</div>
                    <textarea className='checkout__additional-area' placeholder='Notes about your order, e.g. special notes for delivery'></textarea>
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
                        <li className='checkout__order-product rlc'>
                            <div className='checkout__order-text'>Product Name X 1</div>
                            <div className='checkout__order-text'>$329</div>
                        </li>
                        <li className='checkout__order-product rlc'>
                            <div className='checkout__order-text'>Product Name X 1</div>
                            <div className='checkout__order-text'>$329</div>
                        </li>
                    </ul>
                    <div className='checkout__order-delivery rlc'>
                        <div className='checkout__order-text checkout__order-text_bold'>Delivery</div>
                        <div className='checkout__order-text'>Free shipping</div>
                    </div>
                    <div className='checkout__total rlc'>
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_large'>Total</div>
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_primary'>$329</div>
                    </div>
                </div>
                <div className='checkout__order-accept ccc'>PLACE ORDER</div>
            </div>
        </div>
    )
});

export default Checkout