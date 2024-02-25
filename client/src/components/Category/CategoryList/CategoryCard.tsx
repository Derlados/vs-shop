import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import { ICategory } from '../../../types/ICategory';
import { ICategoryList } from '../../../types/magento/ICategoryList';
import { ROUTES } from '../../../values/routes';

interface CategoryCardProps {
  category: ICategoryList;
  onClick?: () => void;
}

const CategoryCard: FC<CategoryCardProps> = observer(({ category, onClick }) => {
  return (
    <NavLink
      className='category-list__category-card  rlc'
      to={!onClick ? `/${ROUTES.CATEGORY_PREFIX}${category.id}` : ''}
      onClick={onClick}
    >
      <div className='category-list__category-text'>
        <div className='category-list__category-name'>{category.name}</div>
        <div className='category-list__category-count-products'>
          Products ({category.product_count})
        </div>
        <span className='category-list__category-shop-now'>Shop now</span>
      </div>
      {/* <img className='category-list__category-img' alt='' src={category.img} /> */}
    </NavLink>
  )
});

export default CategoryCard