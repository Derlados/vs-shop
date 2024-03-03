import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { ICategoryList } from '../../../types/magento/ICategoryList';
import { ROUTES } from '../../../values/routes';
import './catalog-list.scss';

interface CatalogListProps {
  categoryList: ICategoryList;
  onClose: () => void;
}

const CatalogList: FC<CatalogListProps> = observer(({ categoryList, onClose }) => {
  return (
    <ul className='catalog-list'>
      {categoryList.children_data.map(category => (
        <li key={category.id} className='catalog-list__catalog-item clc' >
          <div className='catalog-list__catalog-link rlc'>
            <div className='catalog-list__catalog-name'>
              <div className='catalog-list__catalog-text'>{category.name}</div>
              {/* {catalog.isNew && <div className='catalog-list__new-label'>New</div>} */}
            </div>
            <div className='catalog-list__catalog-arrow'></div>
          </div>
          <div className='catalog-list__categories'>
            <div
              className='catalog-list__category-grid rlt'
              style={{ width: category.children_data.length > 2 ? '550px' : `${170 * category.children_data.length + 40}px` }}
            >
              {category.children_data.map(subCategory => (
                <div key={subCategory.id} className='catalog-list__category-item'>
                  <NavLink
                    className='catalog-list__category-name'
                    to={`${ROUTES.SHOP_ROUTE}/${subCategory.id}`}
                    onClick={onClose}
                  >
                    {category.name}
                  </NavLink>
                  {/* <ul className='catalog-list__brand-list'>
                    {category.allBrands?.slice(0, 20).map(brand => (
                      <NavLink key={brand} to={`${ROUTES.CATEGORY_PREFIX}${category.routeName}/brands=${brand}`} onClick={onClose}>
                        <li className='catalog-list__brand-item'>{brand}</li>
                      </NavLink>
                    ))}
                  </ul> */}
                </div>
              ))}
            </div>

          </div>
        </li>
      ))}
    </ul>
  )
});

export default CatalogList