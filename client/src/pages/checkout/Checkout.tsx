import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, NavLink } from 'react-router-dom';
import './checkout.scss';
import cartStore from '../../stores/cart/cart.store';
import Selector from '../../lib/components/Selector/Selector';
import Input from '../../lib/components/Input/Input';
import classNames from 'classnames';
import { REGEX } from '../../values/regex';
import settlementStore from '../../stores/settlement/settlement.store';
import Modal from '../../lib/components/Modal/Modal';
import Loader from '../../lib/components/Loader/Loader';
import { IShippingInformation } from '../../types/magento/IShippingInformation';
import { IWarehouse } from '../../types/novaposhta/IWarehouse';
import { ISettlement } from '../../types/novaposhta/ISettlement';

const phoneMask = '+38 999 999 99 99';

interface CheckoutPageStore {
  isTriedToPlace: boolean;
  warehouse?: IWarehouse;
  comment?: string;
}

const Checkout = observer(() => {
  const checkoutPageStore = useLocalObservable<CheckoutPageStore>(() => ({
    isTriedToPlace: false,
    warehouse: undefined,
    comment: '',
  }));

  const onTryToPlace = () => {
    checkoutPageStore.isTriedToPlace = true;
    if (!cartStore.isValidCheckout) return;

    cartStore.placeOrder(checkoutPageStore.comment);
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

  const getWarehouseValues = (warehouses: IWarehouse[]) => {
    const warehouseValues = new Map<string, string>();
    for (const warehouse of warehouses) {
      warehouseValues.set(warehouse.siteKey, warehouse.address);
    }

    return warehouseValues;
  }

  const getSettlementFullName = (settlement: ISettlement) => {
    const settlementTypeAbb = settlement.settlementType.substring(0, 1);
    let settlementFullName = `${settlementTypeAbb}. ${settlement.name}`;
    if (settlement.area) {
      settlementFullName += ` - ${settlement.area}`
    }

    return settlementFullName;
  }

  const onChangeField = (v: React.ChangeEvent<HTMLInputElement>) => {
    const validKeys = ["firstname", "lastname", "telephone", "email"];
    const key = v.target.name;
    if (!validKeys.includes(key)) {
      return;
    }

    cartStore.updateShippingInformation(
      key as keyof IShippingInformation["addressInformation"]["shippingAddress"],
      v.target.value
    );
  }

  const onAdditionalInfoChange = (v: React.ChangeEvent<HTMLTextAreaElement>) => {
    checkoutPageStore.comment = v.target.value;
  }

  const onSelectSettlement = (settlementRef: string) => {
    const selectedSettlement = settlementStore.settlements.find(s => s.ref === settlementRef)
    if (selectedSettlement) {
      settlementStore.selectSettlement(settlementRef);
      cartStore.clearSettlement();
    }
  }

  const onSelectWarehouse = (key: string) => {
    const warehouse = settlementStore.warehouses.find(w => w.siteKey === key);
    const selectedSettlement = settlementStore.settlements.find(s => s.ref === settlementStore.selectedSettlementRef);
    if (!warehouse || !selectedSettlement) return;

    checkoutPageStore.warehouse = warehouse;
    cartStore.setSettlement(selectedSettlement, warehouse);
  }

  if (cartStore.cart.items.length === 0) {
    return <Navigate to={'/home'} />
  }

  return (
    <div className='checkout rlt'>
      <div className='checkout__details clt'>
        <div className='checkout__title'>Деталі замовлення</div>
        <div className='checkout__inputs-row rlt'>
          <Input className={classNames('checkout__input', {
            'checkout__input_invalid': checkoutPageStore.isTriedToPlace && cartStore.getAddressInfoByKey("firstname") === ''
          })}
            name="firstname"
            hint="Ім'я"
            value={cartStore.getAddressInfoByKey("firstname")}
            onChange={onChangeField}
            error={cartStore.validErrors.firstname}
            showErrors={checkoutPageStore.isTriedToPlace}
          />
          <Input className={classNames('checkout__input', {
            'checkout__input_invalid': checkoutPageStore.isTriedToPlace && cartStore.getAddressInfoByKey("lastname") === ''
          })}
            name="lastname"
            hint="Прізвище"
            value={cartStore.getAddressInfoByKey("lastname")}
            onChange={onChangeField}
            error={cartStore.validErrors.lastname}
            showErrors={checkoutPageStore.isTriedToPlace}
          />
        </div>
        <div className='checkout__inputs-row rlt'>
          <Input className={classNames('checkout__input', {
            'checkout__input_invalid': checkoutPageStore.isTriedToPlace && !REGEX.PHONE_REGEX.test(cartStore.getAddressInfoByKey<string>("telephone"))
          })}
            name="telephone"
            mask={phoneMask}
            placeholder="+38 ___ ___ __ __"
            hint='Номер телефону'
            value={cartStore.getAddressInfoByKey("telephone")}
            onChange={onChangeField}
            error={cartStore.validErrors.telephone}
            showErrors={checkoutPageStore.isTriedToPlace}
          />
          <Input className={classNames('checkout__input', {
            'checkout__input_invalid': checkoutPageStore.isTriedToPlace
              && (!REGEX.EMAIL_REGEX.test(cartStore.getAddressInfoByKey("email")) && cartStore.getAddressInfoByKey("email") != '')
          })}
            name="email"
            hint="Електронна пошта (не обов'язково)"
            value={cartStore.getAddressInfoByKey("email")}
            onChange={onChangeField}
            error={cartStore.validErrors.email}
            showErrors={checkoutPageStore.isTriedToPlace}
          />
        </div>
        <Selector
          className='checkout__selector'
          withInput={true}
          hint={'Населений пункт України'}
          values={getSettlementValues(settlementStore.settlements)}
          onSelect={onSelectSettlement}
          onChange={(searchString: string) => settlementStore.findSettlements(searchString)}
        />
        {cartStore.validErrors.city && checkoutPageStore.isTriedToPlace && (
          <div className='checkout__error'>{cartStore.validErrors.city}</div>
        )}
        <Selector
          className='checkout__selector'
          withInput={true}
          withSearch={true}
          hint={'Адреса точки видачі'}
          values={getWarehouseValues(settlementStore.warehouses)}
          selectedId={checkoutPageStore.warehouse?.siteKey}
          onSelect={(key, _) => onSelectWarehouse(key)}
        />
        {cartStore.validErrors.street && checkoutPageStore.isTriedToPlace && (
          <div className='checkout__error'>{cartStore.validErrors.street}</div>
        )}
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
            <div className='checkout__order-text checkout__order-text_bold checkout__order-text_large'>Товар</div>
            <div className='checkout__order-text checkout__order-text_bold checkout__order-text_large'>Сума</div>
          </div>
          <ul className='checkout__order-product-list'>
            {cartStore.totals?.items.map(item => (
              <li key={item.item_id} className='checkout__order-product rlc'>
                <div className='checkout__order-text'>{`${item.name} × ${item.qty}`}</div>
                <div className='checkout__order-text'>{formatMoney(item.price * item.qty)}</div>
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
            <div className='checkout__order-text checkout__order-text_bold checkout__order-text_primary'>{cartStore.totals?.grand_total.toFixed(2)} ₴</div>
          </div>
        </div>
        <div className='checkout__order-accept ccc' onClick={onTryToPlace}>ОФОРМИТИ ЗАМОВЛЕННЯ</div>
      </div>
      <Modal isActive={cartStore.status === "placing" || cartStore.status === "placing-success"} setActive={() => { }} >
        <div className='checkout__modal ccc'>
          {cartStore.status === "placing" && <Loader />}
          {cartStore.status === "placing-success" &&
            <div className='checkout__modal-success ccc'>
              <div className='checkout__modal-icon ccc'>✓</div>
              <div className='checkout__modal-text'>Ваше замовлення надіслано успішно !</div>
              <NavLink to={'/home'} className='checkout__modal-btn-back ccc'>До головної</NavLink>
            </div>
          }
        </div>
      </Modal>
    </div>
  );
});

export default Checkout