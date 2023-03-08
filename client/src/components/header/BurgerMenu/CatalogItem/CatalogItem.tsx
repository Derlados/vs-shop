import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import Dropdown from '../../../../lib/components/Dropdown/Dropdown';
import { ICatalog } from '../../../../types/ICatalog'
import { ROUTES } from '../../../../values/routes';

interface CatalogItemProps {
    catalog: ICatalog;
    onClick: () => void;
}

interface LocalStore {
    isOpenCategories: boolean;
}

const CatalogItem: FC<CatalogItemProps> = observer(({ catalog, onClick }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        isOpenCategories: false
    }))

    const toggleList = () => {
        localStore.isOpenCategories = !localStore.isOpenCategories;
    }

    return (
        <li key={catalog.id} className='burger-menu__sublist'>
            <div className={classNames('burger-menu__item burger-menu_underline burger-menu__item-name burger-menu__item-name_subitem-first', {
                'burger-menu__item-name_selected': localStore.isOpenCategories
            })} onClick={toggleList}>
                {catalog.name}
            </div>
            <Dropdown className='burger-menu__dropdown' isOpen={localStore.isOpenCategories}>
                <ul className='burger-menu__sublist'>
                    {catalog.categories.map(category => (
                        <li key={category.id} className='burger-menu__item burger-menu_underline'>
                            <NavLink className=' burger-menu__item-name burger-menu__item-name_subitem-second' to={`${ROUTES.CATEGORY_PREFIX}${category.routeName}`}
                                onClick={onClick}>
                                {category.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </Dropdown>
        </li>
    )
});

export default CatalogItem