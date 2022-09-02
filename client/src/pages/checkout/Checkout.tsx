import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, NavLink } from 'react-router-dom';
import Loader from '../../lib/components/Loader/Loader';
import Modal from '../../lib/components/Modal/Modal';
import Selector from '../../lib/components/Selector/Selector';
import cart from '../../store/cart';
import orders from '../../store/order';
import './checkout.scss';
import { ICartProduct } from '../../types/ICartProduct';
import { IOrder, OrderStatus } from '../../types/IOrder';
import { ISettlement } from '../../types/ISettlement';
import { REGEX } from '../../values/regex';
import settlement from '../../store/settlement';
import Input from '../../lib/components/Input/Input';

interface LocalStore {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    settlement: string;
    warehouse: string;
    additionalInfo: string;
    isValidForm: boolean;
    isSending: boolean;
    isSentSuccessfully: boolean;
    copyTotal: number;
    copyProducts: ICartProduct[];
}

const phoneMask = '+38 999 999 99 99';
const PHONE_REGEX = /(\+38 ([0-9]){3} ([0-9]){3} ([0-9]){2} ([0-9]+){2})/;

const Checkout = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        firstName: '',
        lastName: '',
        phone: "",
        email: '',
        settlement: '',
        warehouse: '',
        additionalInfo: '',
        isValidForm: true,
        isSending: false,
        isSentSuccessfully: false,
        copyTotal: -1,
        copyProducts: []
    }))

    const tryPlaceOrder = async () => {
        if (localStore.isSentSuccessfully) {
            return;
        }

        localStore.isValidForm = true;
        if (!validate()) {
            localStore.isValidForm = false;
            return;
        }

        const order: IOrder = {
            id: -1,
            client: `${localStore.lastName} ${localStore.firstName}`,
            phone: localStore.phone,
            email: localStore.email != '' ? localStore.email : undefined,
            address: `${localStore.settlement} - ${localStore.warehouse}`,
            additionalInfo: localStore.additionalInfo,
            totalPrice: cart.totalPrice,
            orderProducts: cart.cartProducts,
            payment: { id: 1, method: 'Накладенний платіж' },
            createdAt: new Date(),
            status: OrderStatus.NOT_PROCESSED
        }

        localStore.isSending = true;
        const success = await orders.placeOrder(order);
        if (success) {
            localStore.isSentSuccessfully = true;
            localStore.copyTotal = cart.totalPrice;
            localStore.copyProducts = [...cart.cartProducts];
            cart.clearUserProducts();
        }
        localStore.isSending = false;
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

    const onSelectSettlement = (settlementRef: string, settlementName: string) => {
        const selectedSettlement = settlement.settlements.find(s => s.ref == settlementRef)
        if (selectedSettlement) {
            localStore.settlement = getSettlementFullName(selectedSettlement);
            localStore.warehouse = '';
        }
        settlement.selectSettlement(settlementRef);
    }

    const validate = () => {
        return localStore.firstName !== '' && localStore.lastName !== '' && PHONE_REGEX.test(localStore.phone)
            && (localStore.email == '' || REGEX.EMAIL_REGEX.test(localStore.email)) && localStore.settlement !== '' && localStore.warehouse !== '';
    }

    if (!cart.isInit) {
        return (
            <div className='checkout ccc'>
                <Loader />
            </div>
        )
    }

    if (cart.cartProducts.length === 0 && localStore.copyProducts.length === 0) {
        return <Navigate to={'/home'} />
    }

    return (
        <div className='checkout rlt'>
            <div className='checkout__details clt'>
                <div className='checkout__title'>Деталі замовлення</div>
                <div className='checkout__inputs-row rlc'>
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': !localStore.isValidForm && localStore.firstName === ''
                    })}
                        hint="Ім'я"
                        value={localStore.firstName}
                        onChange={(v) => localStore.firstName = v.target.value}
                    />
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': !localStore.isValidForm && localStore.lastName === ''
                    })}
                        hint="Призвіще"
                        value={localStore.lastName}
                        onChange={(v) => localStore.lastName = v.target.value}
                    />
                </div>
                <div className='checkout__inputs-row rlc'>
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': !localStore.isValidForm && !PHONE_REGEX.test(localStore.phone)
                    })}
                        mask={phoneMask}
                        placeholder="+38 ___ ___ __ __"
                        hint='Номер телефону'
                        value={localStore.phone}
                        onChange={(v) => localStore.phone = v.target.value}
                    />
                    <Input className={classNames('checkout__input', {
                        'checkout__input_invalid': !localStore.isValidForm && (!REGEX.EMAIL_REGEX.test(localStore.email) && localStore.email != '')
                    })}
                        hint="Електронна пошта (не обов'язково)"
                        value={localStore.email}
                        onChange={(v) => localStore.email = v.target.value}
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
                    selectedId={localStore.warehouse}
                    onSelect={(warehouse: string) => localStore.warehouse = warehouse} />
                <div className='checkout__additional-info'>
                    <div className='checkout__additional-head'>Додаткова інформація</div>
                    <textarea className='checkout__additional-area' placeholder='Notes about your order, e.g. special notes for delivery' onChange={(v) => localStore.additionalInfo = v.target.value}></textarea>
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
                        {(cart.cartProducts.length != 0 ? cart.cartProducts : localStore.copyProducts).map(cp => (
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
                        <div className='checkout__order-text checkout__order-text_bold checkout__order-text_primary'>{cart.totalPrice !== 0 ? cart.totalPrice.toFixed(2) : localStore.copyTotal.toFixed(2)} ₴</div>
                    </div>
                </div>
                <div className='checkout__order-accept ccc' onClick={tryPlaceOrder}>ОФОРМИТИ ЗАМОВЛЕННЯ</div>
                {orders.apiError && <div className='checkout__error'>* {orders.apiError}</div>}
            </div>
            <Modal isActive={localStore.isSending || localStore.isSentSuccessfully} setActive={() => { }} >
                <div className='checkout__modal ccc'>
                    {localStore.isSending && <Loader />}
                    {localStore.isSentSuccessfully &&
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