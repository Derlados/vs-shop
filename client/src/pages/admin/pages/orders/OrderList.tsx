
import order, { OrderSorts } from '../../../../store/order'
import OrderItem from './compoentns/OrderItem'
import '../../../../styles/admin/orders.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import classNames from 'classnames';
import { useEffect } from 'react';
import Loader from '../../../../lib/Loader/Loader';
import Checkbox from '../../../../lib/Checkbox/Checkbox';

interface LocalStore {
    isLoading: boolean;
}

const OrderList = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        isLoading: false
    }))

    useEffect(() => {
        async function fetchOrders() {
            await order.fetchOrders();
            localStore.isLoading = false;
        }

        fetchOrders();
        // localStore.isLoading = true;
    }, [])

    return (
        <div className='orders'>
            <div className='orders__title'>Замовлення</div>
            <div className='orders__content'>
                <div className='orders__head rlc'>
                    <div className='orders__actions rlc'>
                        <div className='orders__orders-count'>Замовлення ({order.orders.length})</div>
                        <div className='orders__delete-btn'></div>
                    </div>
                    <div className='orders__actions rlc'>
                        <input className='orders__search ccc' placeholder='Search ...' />
                        <div className='orders__export ccc'>Export table</div>
                    </div>
                </div>
                <div className='orders__list-header rcc'>
                    <Checkbox className='orders__column-checker' checked={order.selectedAll} onChange={() => order.toggleSelectAll()} />
                    <div className='orders__column orders__column_small'>
                        <span className='orders__column-text'>ID</span>
                    </div>
                    <div className='orders__column'>
                        <span className='orders__column-text'>Клієнт</span>
                    </div>
                    <div className='orders__column orders__column_touchable'
                        onClick={() => order.selectedSort == OrderSorts.DATE_DESC ? order.selectedSort = OrderSorts.DATE_ASC : order.selectedSort = OrderSorts.DATE_DESC}>
                        <span className={classNames('orders__column-text orders__column-text_sort', {
                            'orders__column-text_sort-asc': order.selectedSort == OrderSorts.DATE_ASC,
                            'orders__column-text_sort-desc': order.selectedSort == OrderSorts.DATE_DESC
                        })}>Дата замовлення</span>
                    </div>
                    <div className='orders__column orders__column_touchable'
                        onClick={() => order.selectedSort == OrderSorts.PRICE_DESC ? order.selectedSort = OrderSorts.PRICE_ASC : order.selectedSort = OrderSorts.PRICE_DESC}>
                        <span className={classNames('orders__column-text orders__column-text_sort', {
                            'orders__column-text_sort-asc': order.selectedSort == OrderSorts.PRICE_ASC,
                            'orders__column-text_sort-desc': order.selectedSort == OrderSorts.PRICE_DESC
                        })}>Загальна сума</span>
                    </div>
                    <div className='orders__column orders__column_touchable'>
                        <span className='orders__column-text'>Спосіб оплати</span>
                    </div>
                    <div className='orders__column orders__column_touchable'>
                        <span className='orders__column-text'>Статус</span>
                    </div>
                </div>
                {localStore.isLoading ?
                    <div className='orders__loader ccc'>
                        <Loader />
                    </div>
                    :
                    <ul className='orders__list'>
                        {order.orders.map(order => (
                            <OrderItem key={order.id} order={order} />
                        ))}
                    </ul>
                }
            </div>
            <div className='orders__pagination rrc'>
                <div className='orders__pagination-arrow ccc' onClick={() => order.backPage()}>{'<'}</div>
                <div className='orders__page-number ccc'>{order.selectedPage}</div>
                <div className='orders__pagination-arrow ccc' onClick={() => order.nextPage()}>{'>'}</div>
            </div>
        </div>
    )
});

export default OrderList