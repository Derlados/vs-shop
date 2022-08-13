import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import '../filters.scss';

interface FilterCategoriesProps {
    filterCategories: IFilterCategory[];
}

export interface IFilterCategory {
    name: string;
    link: string;
    productCount: number;
}

const FilterCategories: FC<FilterCategoriesProps> = observer(({ filterCategories }) => {
    return (
        <div className='filters__content'>
            <div className='filters__title'>Знайдені каталоги</div>
            <div className='filters__line'></div>
            <ul className='filters__categories clc'>
                {filterCategories.map(fc => (
                    <li key={fc.name} className='filters__attr filters__categories-item'>
                        <NavLink className='filters__attr-name filters__categories-link' to={fc.link}>{fc.name} ({fc.productCount})</NavLink>
                    </li>
                ))}
            </ul>
        </div>
    )
});

export default FilterCategories