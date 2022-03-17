import classNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react-lite';
import React from 'react'
import shop, { SortType } from '../../../store/shop';

enum ViewMode {
    GRID,
    LIST
}

interface LocalStore {
    isOpenSort: boolean;
    selectedViewMode: ViewMode;
}

const sortTypes: Map<SortType, string> = new Map([
    [SortType.PRICE_ASC, "От дешевых к дорогим"],
    [SortType.PRICE_DESC, "От дорогих к дешевым"],
    [SortType.DISCOUNT, "Скидки"],
    [SortType.NEW, "Новинки"]
]);

const CatalogSettings = observer(() => {
    console.log("render");

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

    const selectViewMode = (viewMode: ViewMode) => {
        localStore.selectedViewMode = viewMode;
    }

    return (
        <div className='catalog__settings rcc'>
            <div className='catalog__view-modes rlc'>
                <div className={classNames('catalog__mask-container',
                    { 'catalog__mask-container_selected': localStore.selectedViewMode == ViewMode.GRID })}
                    onClick={() => selectViewMode(ViewMode.GRID)}>
                    <div className='catalog__view-mode catalog__view-grid'></div>
                </div>
                <div className={classNames('catalog__mask-container',
                    { 'catalog__mask-container_selected': localStore.selectedViewMode == ViewMode.LIST })}
                    onClick={() => selectViewMode(ViewMode.LIST)}>
                    <div className='catalog__view-mode catalog__view-list'></div>
                </div>
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