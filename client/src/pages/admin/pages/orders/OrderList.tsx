
import orders from '../../../../store/orders'
import OrderItem from './OrderItem'
import '../../../../styles/admin/orders.scss';

const OrderList = () => {
    return (
        <div className='orders'>
            <div className='orders__head rlc'>
                <div className='orders__title'>{`Orders (${5})`}</div>
                <div className='orders__actions'>
                    <div className='orders__sort'></div>
                    <input className='orders__search' placeholder='Search ...' />
                    <div className='orders__export'></div>
                </div>
            </div>
            <div className='orders__list-header rcc'>
                <div className='orders__list-column'>ID</div>
                <div className='orders__list-column'>New Client?</div>
                <div className='orders__list-column'>Price</div>
                <div className='orders__list-column'>Payment</div>
                <div className='orders__list-column'>Status</div>
            </div>
            <ul className='orders__list'>
                {orders.orders.map(order => (
                    <OrderItem order={order} />
                ))}
            </ul>
        </div>
    )
}

export default OrderList