import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, NavLink } from 'react-router-dom';
import Loader from '../../lib/components/Loader/Loader';
import Modal from '../../lib/components/Modal/Modal';
import Selector from '../../lib/components/Selector/Selector';
import cart from '../../store/cart/cart';
import orders from '../../store/order';
import './checkout.scss';
import { ISettlement } from '../../types/ISettlement';
import { REGEX } from '../../values/regex';
import settlement from '../../magento_stores/settlement/settlement.store';
import Input from '../../lib/components/Input/Input';
import { CheckoutStore, CheckoutStoreStatus } from '../../store/checkout/checkout.store';
import { useEffect } from 'react';


const phoneMask = '+38 999 999 99 99';

const Checkout = observer(() => {
    const checkoutStore = useLocalObservable(() => new CheckoutStore());

    useEffect(() => {
        checkoutStore.init(cart.cartId);
    }, [])

    const tryPlaceOrder = async () => {
        checkoutStore.accept();
        // if (localStore.isSentSuccessfully) {
        //     return;
        // }

        // const order: IOrder = {
        //     id: -1,
        //     client: `${checkoutStore.lastName} ${checkoutStore.firstName}`,
        //     phone: checkoutStore.phone,
        //     email: checkoutStore.email != '' ? checkoutStore.email : undefined,
        //     address: `${checkoutStore.settlement} - ${checkoutStore.warehouse}`,
        //     additionalInfo: checkoutStore.additionalInfo,
        //     totalPrice: checkoutStore.totalPrice,
        //     orderProducts: checkoutStore.cartProducts,
        //     payment: { id: 1, method: 'Накладенний платіж' },
        //     createdAt: new Date(),
        //     status: OrderStatus.NOT_PROCESSED
        // }

        // localStore.isSending = true;
        // const success = await orders.placeOrder(order);
        // if (success) {
        //     localStore.isSentSuccessfully = true;
        //     localStore.copyTotal = cart.totalPrice;
        //     localStore.copyProducts = [...cart.cartProducts];
        //     cart.clearUserProducts();
        // }
        // localStore.isSending = false;
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

    const onFirstNameChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        checkoutStore.onFirstNameChange(v.target.value);
    }

    const onLastNameChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        checkoutStore.onLastNameChange(v.target.value);
    }

    const onPhoneChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        checkoutStore.onPhoneChange(v.target.value);
    }

    const onEmailChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        checkoutStore.onEmailChange(v.target.value);
    }

    const onAdditionalInfoChange = (v: React.ChangeEvent<HTMLTextAreaElement>) => {
        checkoutStore.onAdditionalInfoChange(v.target.value);
    }


    const onSelectSettlement = (settlementRef: string) => {
        const selectedSettlement = settlement.settlements.find(s => s.ref === settlementRef)
        if (selectedSettlement) {
            checkoutStore.onSettlementChange(getSettlementFullName(selectedSettlement));
        }
        settlement.selectSettlement(settlementRef);
    }

    const onSelectWarehouse = (warehouse: string) => {
        checkoutStore.onWarehouseChange(warehouse);
    }


    if (!cart.isInit || checkoutStore.status === CheckoutStoreStatus.initializing || checkoutStore.status === CheckoutStoreStatus.initial) {
        return (
            <div className='checkout ccc'>
                <Loader />
            </div>
        )
    }

    if (checkoutStore.cartProducts.length === 0) {
        return <Navigate to={'/home'} />
    }

    return (
        <div className='checkout rlt'>
            <div className='checkout__details clt'>
                <div className='checkout__title'>Деталі замовлення</div>
                <div className='checkout__inputs-row rlc'>
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': checkoutStore.isTrienToPlace && checkoutStore.firstName === ''
                    })}
                        hint="Ім'я"
                        value={checkoutStore.firstName}
                        onChange={onFirstNameChange}
                    />
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': checkoutStore.isTrienToPlace && checkoutStore.lastName === ''
                    })}
                        hint="Прізвище"
                        value={checkoutStore.lastName}
                        onChange={onLastNameChange}
                    />
                </div>
                <div className='checkout__inputs-row rlc'>
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': checkoutStore.isTrienToPlace && !REGEX.PHONE_REGEX.test(checkoutStore.phone)
                    })}
                        mask={phoneMask}
                        placeholder="+38 ___ ___ __ __"
                        hint='Номер телефону'
                        value={checkoutStore.phone}
                        onChange={onPhoneChange}
                    />
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': checkoutStore.isTrienToPlace && (!REGEX.EMAIL_REGEX.test(checkoutStore.email) && checkoutStore.email != '')
                    })}
                        hint="Електронна пошта (не обов'язково)"
                        value={checkoutStore.email}
                        onChange={onEmailChange}
                    />
                </div>
                <Selector
                    className='checkout__selector'
                    withInput={true}
                    hint={'Населений пункт України'}
                    values={getSettlementValues(settlement.settlements)}
                    onSelect={onSelectSettlement}
                    onChange={(searchString: string) => settlement.findSettlements(searchString)} />
                <Selector
                    className='checkout__selector'
                    withInput={true}
                    withSearch={true}
                    hint={'Адреса точки видачі'}
                    values={getWarehouseValues(settlement.warehouses)}
                    selectedId={checkoutStore.warehouse}
                    onSelect={onSelectWarehouse} />
                <div className='checkout__additional-info'>
                    <div className='checkout__additional-head'>Додаткова інформація</div>
                    <textarea
                        className='checkout__additional-area'
                        placeholder='Notes about your order, e.g. special notes for delivery'
                        onChange={onAdditionalInfoChange}
                    ></textarea>
                </div>
            </div>
            <div className='checkout__order clt'>
                <div className='checkout__title'>Ваше замовлення</div>
                <div className='checkout__order-container clc'>
                    <div className='checkout__order-head rlc'>
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_large'>Product</div>
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_large'>Total</div>
                    </div>
                    <ul className='checkout__order-product-list'>
                        {checkoutStore.cartProducts.map(cp => (
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
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_primary'>{checkoutStore.totalPrice.toFixed(2)} ₴</div>
                    </div>
                </div>
                <div className='checkout__order-accept ccc' onClick={tryPlaceOrder}>ОФОРМИТИ ЗАМОВЛЕННЯ</div>
                {orders.apiError && <div className='checkout__error'>* {orders.apiError}</div>}
            </div>
            <Modal isActive={checkoutStore.status == CheckoutStoreStatus.placing || checkoutStore.status == CheckoutStoreStatus.placingSuccess} setActive={() => { }} >
                <div className='checkout__modal ccc'>
                    {checkoutStore.status == CheckoutStoreStatus.placing && <Loader />}
                    {checkoutStore.status == CheckoutStoreStatus.placingSuccess &&
                        <div className='checkout__modal-success ccc'>
                            <div className='checkout__modal-icon ccc'>✓</div>
                            <div className='checkout__modal-text'>Ваше замовлення надіслано успішно !</div>
                            <NavLink to={'/home'} className='checkout__modal-btn-back ccc'>До головної</NavLink>
                        </div>
                    }
                </div>
            </Modal>
        </div>
    )
});

export default Checkout