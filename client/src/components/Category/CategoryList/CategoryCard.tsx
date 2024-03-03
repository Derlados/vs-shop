import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import categoryHelper from '../../../helpers/category.helper';
import mediaHelper from '../../../helpers/media.helper';
import { ICategory } from '../../../types/magento/ICategory';
import { ICategoryList } from '../../../types/magento/ICategoryList';
import { ROUTES } from '../../../values/routes';

interface CategoryCardProps {
  category: ICategory;
  poductsCount: number;
  onClick?: () => void;
}

const CategoryCard: FC<CategoryCardProps> = observer(({ category, poductsCount, onClick }) => {
  const image = categoryHelper.getImage(category);
  const imageUrl = image ? mediaHelper.getCatalogUrl(image, "category") : '';

  return (
    <NavLink
      className='category-list__category-card  rlc'
      to={!onClick ? `/${ROUTES.SHOP_ROUTE}/${categoryHelper.getUrlPath(category)}` : ''}
      onClick={onClick}
    >
      <div className='category-list__category-text'>
        <div className='category-list__category-name'>{category.name}</div>
        <div className='category-list__category-count-products'>
          Products ({poductsCount})
        </div>
        <span className='category-list__category-shop-now'>Shop now</span>
      </div>
      <img className='category-list__category-img' alt='' src={imageUrl} />
    </NavLink>
  )
});

export default CategoryCard