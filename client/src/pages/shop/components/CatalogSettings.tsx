import classNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react-lite';
import React, { FC } from 'react'
import shop, { SortType } from '../../../store/shop';
import { ViewMode } from './ProductCatalog';

interface LocalStore {
    isOpenSort: boolean;
}

interface CatalogSettingsProps {
    selectedViewMode: ViewMode;
    onSelectViewMode: (viewMode: ViewMode) => void;
    onOpenFilters: () => void;
}

const sortTypes: Map<SortType, string> = new Map([
    [SortType.PRICE_ASC, "От дешевых к дорогим"],
    [SortType.PRICE_DESC, "От дорогих к дешевым"],
    [SortType.DISCOUNT, "Скидки"],
    [SortType.NEW, "Новинки"]
]);

const CatalogSettings: FC<CatalogSettingsProps> = observer(({ selectedViewMode, onSelectViewMode, onOpenFilters }) => {
    const localStore = useLocalStore<LocalStore>(() => ({
        isOpenSort: false,
        selectedViewMode: ViewMode.GRID
    }))

    const toggleSortList = () => {
        localStore.isOpenSort = !localStore.isOpenSort;
    }

    const selectSort = (sortType: SortType) => {
        localStore.isOpenSort = false;
        shop.setSortType(sortType)
    }

    return (
        <div className='catalog__settings rcc'>
            <div className='catalog__view-and-sort rlc'>
                <div className='catalog__view-modes rlc'>
                    <div className={classNames('catalog__mask-container',
                        { 'catalog__mask-container_selected': selectedViewMode == ViewMode.GRID })}
                        onClick={() => onSelectViewMode(ViewMode.GRID)}>
                        <div className='catalog__view-mode catalog__view-grid'></div>
                    </div>
                    <div className={classNames('catalog__mask-container',
                        { 'catalog__mask-container_selected': selectedViewMode == ViewMode.LIST })}
                        onClick={() => onSelectViewMode(ViewMode.LIST)}>
                        <div className='catalog__view-mode catalog__view-list'></div>
                    </div>
                </div>
                <div className='catalog__filters ccc' onClick={onOpenFilters}>Фільтри</div>
            </div>

            <div className='catalog__sort'>
                <div className={classNames('catalog__selected-sort', {
                    'catalog__selected-sort_open': localStore.isOpenSort
                })} onClick={toggleSortList}>{shop.selectedSort == SortType.NOT_SELECTED ? "Не выбрано" : sortTypes.get(shop.selectedSort)}</div>
                <ul className={classNames('catalog__sort-list', {
                    'catalog__sort-list_open': localStore.isOpenSort
                })}>
                    {Array.from(sortTypes.keys()).map(sortType => (
                        <li key={sortType} className='catalog__sort-item' onClick={() => selectSort(sortType)}>
                            {sortTypes.get(sortType)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
});

export default CatalogSettings