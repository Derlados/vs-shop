
import orders, { OrderSorts } from '../../../../store/order'
import OrderItem from './compoentns/OrderItem'
import './orders.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import classNames from 'classnames';
import { useEffect } from 'react';
import Loader from '../../../../lib/Loader/Loader';
import Checkbox from '../../../../lib/Checkbox/Checkbox';

interface LocalStore {
    isInit: boolean;
    isLoading: boolean;
    timer: NodeJS.Timeout;
}

const OrderList = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        isInit: false,
        isLoading: false,
        timer: setTimeout(() => { }, 0)
    }))

    // Отложенная загрузка, когда пользователь
    const setLoadingTimer = (callBack: Function, delay: number) => {
        clearTimeout(localStore.timer);
        localStore.timer = setTimeout(() => callBack(), delay);
    }

    useEffect(() => {
        async function fetchOrders() {
            await orders.fetchOrders();
            localStore.isLoading = false;
        }

        setLoadingTimer(() => fetchOrders(), localStore.isInit ? 400 : 0);
        localStore.isInit = true;
        localStore.isLoading = true;
    }, [orders.startDate, orders.endDate, orders.selectedPage, orders.searchString, orders.selectedSort])


    return (
        <div className='orders'>
            <div className='admin-general__title'>Замовлення</div>
            <div className='orders__content'>
                <div className='orders__head rlc'>
                    <div className='orders__actions rlc'>
                        <div className='orders__orders-count'>Замовлення ({orders.maxOrders})</div>
                        <div className='orders__delete-btn' onClick={() => orders.deleteSelectedOrders()}></div>
                    </div>
                    <div className='orders__actions rlc'>
                        <div className='orders__date-interval rlc'>
                            <input className='orders__date-picker' type="date" value={orders.startDate.toLocaleDateString('en-CA')} min="2022-01-01" max={new Date().toLocaleDateString('en-CA')} onChange={v => orders.setDateInterval(new Date(v.target.value), orders.endDate)} />
                            <div className='orders__date-hyphen'>-</div>
                            <input className='orders__date-picker' type="date" value={orders.endDate.toLocaleDateString('en-CA')} min="2022-01-01" max={new Date().toLocaleDateString('en-CA')} onChange={v => orders.setDateInterval(orders.startDate, new Date(v.target.value))} />
                        </div>
                        <input className='orders__search ccc' value={orders.searchString} placeholder='Search ...' onChange={v => orders.setSearchString(v.target.value)} />
                        <div className='orders__export ccc'>Export table</div>
                    </div>
                </div>
                <div className='orders__list-header rcc'>
                    <Checkbox className='orders__column-checker' checked={orders.selectedAll} onChange={() => orders.toggleSelectAll()} />
                    <div className='orders__column orders__column_small'>
                        <span className='orders__column-text'>ID</span>
                    </div>
                    <div className='orders__column orders__column_optional'>
                        <span className='orders__column-text'>Клієнт</span>
                    </div>
                    <div className='orders__column orders__column_optional-second  orders__column_touchable'
                        onClick={() => orders.selectedSort == OrderSorts.DATE_DESC ? orders.selectedSort = OrderSorts.DATE_ASC : orders.selectedSort = OrderSorts.DATE_DESC}>
                        <span className={classNames('orders__column-text  orders__column-text_sort', {
                            'orders__column-text_sort-asc': orders.selectedSort == OrderSorts.DATE_ASC,
                            'orders__column-text_sort-desc': orders.selectedSort == OrderSorts.DATE_DESC
                        })}>Дата замовлення</span>
                    </div>
                    <div className='orders__column orders__column_touchable'
                        onClick={() => orders.selectedSort == OrderSorts.PRICE_DESC ? orders.selectedSort = OrderSorts.PRICE_ASC : orders.selectedSort = OrderSorts.PRICE_DESC}>
                        <span className={classNames('orders__column-text orders__column-text_sort', {
                            'orders__column-text_sort-asc': orders.selectedSort == OrderSorts.PRICE_ASC,
                            'orders__column-text_sort-desc': orders.selectedSort == OrderSorts.PRICE_DESC
                        })}>Загальна сума</span>
                    </div>
                    <div className='orders__column orders__column_touchable'>
                        <span className='orders__column-text'>Спосіб оплати</span>
                    </div>
                    <div className='orders__column orders__column_touchable'>
                        <span className='orders__column-text'>Статус</span>
                    </div>
                </div>
                {localStore.isLoading && orders.orders.length == 0 ?
                    <div className='orders__loader ccc'>
                        <Loader />
                    </div>
                    :
                    <ul className={classNames('orders__list', {
                        'orders__list_loading': localStore.isLoading,
                    })}>
                        {orders.orders.map(order => (
                            <OrderItem key={order.id} order={order} />
                        ))}
                    </ul>
                }
            </div>
            <div className='orders__pagination rrc'>
                <div className='orders__pagination-arrow ccc' onClick={() => orders.backPage()}>{'<'}</div>
                <div className='orders__page-number ccc'>{orders.selectedPage}</div>
                <div className='orders__pagination-arrow ccc' onClick={() => orders.nextPage()}>{'>'}</div>
            </div>
        </div>
    )
});

export default OrderList