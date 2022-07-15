import React, { FC } from 'react';
import { IOrder } from '../../../../../types/IOrder';

interface OrderItemProps {
    order: IOrder;
}

const OrderItem: FC<OrderItemProps> = ({ order }) => {

    return (
        <li className='orders__item clc'>
            <div className='orders__short-info rlc'>
                <div className='orders__column orders__column_value orders__column_small'>1</div>
                <div className='orders__column orders__column_value'>Анонім</div>
                <div className='orders__column orders__column_value'>29.09.22</div>
                <div className='orders__column orders__column_value'>Доставка</div>
                <div className='orders__column orders__column_value'></div>
                <div className='orders__column orders__column_value'>
                    <span className='orders__status orders__status_yellow'>Обробляється</span>
                </div>
            </div>
            <div className='orders__extended-info ctc'>
                <div className='rlc'>
                    <div className='orders__ex-info-column'>
                        <div className='orders__ex-info-row orders__ex-info-title'>Загальна інформація</div>
                        <div className='orders__ex-info-row rlt'>
                            <span className='orders__ex-info-text orders__ex-info-text_attr'>Клієнт: </span>
                            <span className='orders__ex-info-text orders__ex-info-text_value'>Петров Иван Иванович</span>
                        </div>
                        <div className='orders__ex-info-row rlt'>
                            <span className='orders__ex-info-text orders__ex-info-text_attr'>Пошта: </span>
                            <span className='orders__ex-info-text orders__ex-info-text_value'>Noname@gmail.com</span>
                        </div>
                        <div className='orders__ex-info-row rlt'>
                            <span className='orders__ex-info-text orders__ex-info-text_attr'>Телефон: </span>
                            <span className='orders__ex-info-text orders__ex-info-text_value'>+380782111785</span>
                        </div>
                        <div className='orders__ex-info-row rlt'>
                            <span className='orders__ex-info-text orders__ex-info-text_attr'>Адреса: </span>
                            <span className='orders__ex-info-text orders__ex-info-text_value'>Броварі - Хмельницька обл., Кам’янець-Подільський p-н. (Кам'янець-Подільський p-н.)</span>
                        </div>
                    </div>
                    <div className='orders__ex-info-column'>
                        <div className='orders__ex-info-row orders__ex-info-title'>Список товарів</div>
                        <div className='orders__ex-info-row rlt'>
                            <span className='orders__ex-info-text orders__ex-info-text_value'>- ВІДЕОКАРТА AFOX RADEON RX 560 4GB X 2<b> - 9999₴</b></span>
                        </div>
                        <div className='orders__ex-info-row rlt'>
                            <span className='orders__ex-info-text orders__ex-info-text_value'>- ВІДЕОКАРТА MSI GEFORCE GT1030 2048MB AERO ITX OC X 2<b> - 9999₴</b></span>
                        </div>
                        <div className='orders__ex-info-row rlt'>
                            <span className='orders__ex-info-text orders__ex-info-text_value'>- ВІДЕОКАРТА AFOX RADEON RX 560 4GB X 2<b> - 9999₴</b></span>
                        </div>
                        <div className='orders__ex-info-row rlt'>
                            <span className='orders__ex-info-text orders__ex-info-text_value'>- ВІДЕОКАРТА AFOX RADEON RX 560 4GB X 2<b> - 9999₴</b></span>
                        </div>

                    </div>
                </div>

                <div className='orders__total-price rrc'>Загальна сума: <span>19999.99 ₴</span></div>
            </div>
        </li>
    )
}

export default OrderItem