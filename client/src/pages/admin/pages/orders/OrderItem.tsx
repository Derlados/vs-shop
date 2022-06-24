import React, { FC } from 'react';
import { IOrder } from '../../../../types/IOrder';

interface OrderItemProps {
    order: IOrder;
}

const OrderItem: FC<OrderItemProps> = ({ order }) => {
    return (
        <li className='orders__item clc'>
            <div className='orders__short-info rlc'>
                <div className='orders__column-value'>1</div>
                <div className='orders__column-value'>No/Yes</div>
                <div className='orders__column-value'>19.99$</div>
                <div className='orders__column-value'>Delivery</div>
                <div className='orders__status'>Paid/Processing/Unpaid</div>
            </div>
            <div className='orders__extended-info'>
                {/* TODO */}
            </div>
        </li>
    )
}

export default OrderItem