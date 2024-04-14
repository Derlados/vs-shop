import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import categoryHelper from '../../../helpers/category.helper';
import catalogStore from '../../../stores/catalog/catalog.store';
import { ICategoryList } from '../../../types/magento/ICategoryList';
import { ROUTES } from '../../../values/routes';
import './catalog-list.scss';

interface CatalogListProps {
  categoryList: ICategoryList;
  onClose: () => void;
}

const CatalogList: FC<CatalogListProps> = observer(({ categoryList, onClose }) => {

  const renderCategory = (category: ICategoryList) => {
    const catagory = catalogStore.getCategoryById(category.id);
    if (!catagory) return null;

    return (
      <li key={category.id} className='catalog-list__category-item'>
        <NavLink
          className='catalog-list__category-link'
          to={`${ROUTES.SHOP_ROUTE}/${categoryHelper.getUrlPath(catagory)}`}
          onClick={onClose}
        >
          {category.name}
        </NavLink>
      </li>
    );
  }

  const renderCatalog = (category: ICategoryList) => {
    return (
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
            {category.children_data.map(subCategory => renderCategory(subCategory))}
          </div>
        </div>
      </li>
    )
  }

  return (
    <ul className='catalog-list'>
      {categoryList.children_data.map(category => (
        category.children_data.length > 0 ? renderCatalog(category) : renderCategory(category)
      ))}
    </ul>
  )
});

export default CatalogList