import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { ICatalog } from '../../../types/ICatalog';
import { ROUTES } from '../../../values/routes';
import './catalog-list.scss';

interface CatalogListProps {
    catalogs: ICatalog[];
    onClose: () => void;
}

const CatalogList: FC<CatalogListProps> = observer(({ catalogs, onClose }) => {
    return (
        <ul className='catalog-list'>
            {catalogs.map(catalog => (
                <li key={catalog.id} className='catalog-list__catalog-item clc' >
                    <div className='catalog-list__catalog-link rlc'>
                        <div className='catalog-list__catalog-name'>
                            <div className='catalog-list__catalog-text'>{catalog.name}</div>
                            {/* {catalog.isNew && <div className='catalog-list__new-label'>New</div>} */}

                        </div>
                        <div className='catalog-list__catalog-arrow'></div>
                    </div>
                    <div className='catalog-list__categories'>
                        <div className='catalog-list__category-grid rlt' style={{ width: catalog.categories.length > 2 ? '550px' : `${170 * catalog.categories.length + 40}px` }}>
                            {catalog.categories.map(category => (
                                <div key={category.id} className='catalog-list__category-item'>
                                    <NavLink className='catalog-list__category-name' to={`${ROUTES.CATEGORY_PREFIX}${category.routeName}`} onClick={onClose}>{category.name}</NavLink>
                                    <ul className='catalog-list__brand-list'>
                                        {category.allBrands?.map(brand => (
                                            <NavLink key={brand} to={`${ROUTES.CATEGORY_PREFIX}${category.routeName}/brands=${brand}`} onClick={onClose}>
                                                <li className='catalog-list__brand-item'>{brand}</li>
                                            </NavLink>
                                        ))}
                                    </ul>
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