import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import Input from '../../components/Input';
import Selector from '../../lib/Selector/Selector';
import cart from '../../store/cart';
import orders from '../../store/orders';
import '../../styles/checkout/checkout.scss';
import { IOrder } from '../../types/IOrder';
import { ISettlement } from '../../types/ISettlement';

interface LocalStore {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    additionalInfo: string;
    isEmailValid: boolean;
}

const EMAIL_REGEX = /\S+@\S+\.\S+/;

const Checkout = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        firstName: '',
        lastName: '',
        phone: '+38 ',
        email: '',
        address: '',
        additionalInfo: '',
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
            && localStore.email && localStore.isEmailValid && localStore.address) {
            const order: IOrder = {
                client: `${localStore.lastName} ${localStore.firstName}`,
                phone: localStore.phone,
                email: localStore.email,
                address: localStore.address,
                additionalInfo: localStore.additionalInfo,
                totalPrice: cart.totalPrice,
                isComplete: false,
                orderProducts: cart.cartProducts
            }

            //TODO
        }
    }

    const getSettlementValues = (settlements: ISettlement[]) => {
        const settlementValues = new Map<string, string>();
        settlements = settlements.slice().sort((a, b) => {
            if (a.settlementType === 'місто') {
                return -1;
            }

            if (a.settlementType === 'село') {
                return 1;
            }

            return 0;
        })
        for (const settlement of settlements) {
            settlementValues.set(settlement.ref, getSettlementFullName(settlement));
        }

        return settlementValues;
    }

    const getWarehouseValues = (warehouses: string[]) => {
        const warehouseValues = new Map<string, string>();
        for (const warehouse of warehouses) {
            warehouseValues.set(warehouse, warehouse);
        }

        return warehouseValues;
    }

    const getSettlementFullName = (settlement: ISettlement) => {
        const settlementTypeAbb = settlement.settlementType.substring(0, 1);
        let settlementFullName = `${settlementTypeAbb}. ${settlement.name}`;
        if (settlement.area) {
            settlementFullName += ` - ${settlement.area}`
        }

        if (settlement.region) {
            settlementFullName += `, ${settlement.region}`
        }

        return settlementFullName;
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
                <Selector
                    className='checkout__selector'
                    withInput={true}
                    hint={'Населений пункт України'}
                    values={getSettlementValues(orders.settlements)}
                    onSelect={(ref: string) => orders.selectSettlement(ref)}
                    onChange={(v) => orders.findSettlements(v)} />
                <Selector
                    className='checkout__selector'
                    withInput={true}
                    withSearch={true}
                    hint={'Адреса точки видачі'}
                    values={getWarehouseValues(orders.warehouses)}
                    onSelect={(v: string) => localStore.address = v} />
                <div className='checkout__additional-info'>
                    <div className='checkout__additional-head'>Additional information</div>
                    <textarea className='checkout__additional-area' placeholder='Notes about your order, e.g. special notes for delivery' onChange={(v) => localStore.additionalInfo = v.target.value}></textarea>
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
                                <div className='checkout__order-text'>{cp.product.title} × {cp.count}</div>
                                <div className='checkout__order-text'>{cp.product.price * cp.count} ₴</div>
                            </li>
                        ))}
                    </ul>
                    <div className='checkout__line'></div>
                    <div className='checkout__order-delivery rlc'>
                        <div className='checkout__order-text checkout__order-text_bold'>Delivery</div>
                        <div className='checkout__order-text'>Free shipping</div>
                    </div>
                    <div className='checkout__line'></div>
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