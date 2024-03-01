import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import productHelper from '../../../../helpers/product.helper';
import { IProduct } from '../../../../types/magento/IProduct';
import React from 'react';

interface PopularProductsProps {
  categoryRoute: string;
  products: IProduct[];
}

const PopularProducts: FC<PopularProductsProps> = ({ categoryRoute, products }) => {
  return (
    <div className='popular-products'>
      <div className='popular-products__head'>Популярні товари</div>
      <ul className='popular-products__list clc'>
        {products.map(product => (
          <li key={product.id} className='popular-products__item rlc'>
            <NavLink to={`/${categoryRoute}/${product.id}`} className='popular-products__link'>
              <img className='popular-products__img' src={productHelper.getMainImage(product) ?? ""} alt={product.id.toString()} />
            </NavLink>
            <div className='popular-products__info clc'>
              <NavLink
                to={`/${categoryRoute}/${product.id}`}
                className='popular-products__title'>
                {product.name}
              </NavLink>
              <div className='popular-products__price'>{product.price}₴</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularProducts;
