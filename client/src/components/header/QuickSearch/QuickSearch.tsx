import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { ChangeEvent, KeyboardEvent, FC } from 'react'
import { ICategory } from '../../../types/ICategory';
import './quick-search.scss';

interface QuickSearchProps {
    value: string;
    categories: ICategory[];
    onFocus: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAccept: () => void;
    onSelectCategory: (route: string) => void;
}

interface LocalStore {
    isOpenCategories: boolean;
    selectedCategory: string;
}

const ALL_CATEGORIES = 'Всі категорії';

const QuickSearch: FC<QuickSearchProps> = observer(({ value, categories, onFocus: onFocusChange, onChange, onAccept, onSelectCategory }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        isOpenCategories: false,
        selectedCategory: ALL_CATEGORIES
    }))

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onAccept();
        }
    }

    const onSelect = (categoryName: string, route: string) => {
        localStore.selectedCategory = categoryName;
        localStore.isOpenCategories = false;
        onSelectCategory(route);
    }

    const toggleList = () => {
        localStore.isOpenCategories = !localStore.isOpenCategories;
    }

    return (
        <div className='quick-search quick-search_full-screen rcc'>
            <div className='quick-search__input-wrapper rcc'>
                <div className='quick-search__icon quick-search__icon_search'></div>
                <input onFocus={onFocusChange}
                    className='quick-search__input' placeholder='Хочу знайти ...' value={value} onChange={onChange} onKeyPress={handleKeyPress} />
                <div className='quick-search__categories'>
                    <div className={classNames('quick-search__selected-category', {
                        'quick-search__selected-category_open': localStore.isOpenCategories
                    })} onClick={toggleList}>{localStore.selectedCategory}</div>
                    <ul className={classNames('quick-search__category-list', {
                        'quick-search__category-list_open': localStore.isOpenCategories
                    })}>
                        <li className='quick-search__category-item' onClick={() => onSelect(ALL_CATEGORIES, '')}>{ALL_CATEGORIES}</li>
                        {categories.map(c => (
                            <li key={c.id} className='quick-search__category-item' onClick={() => onSelect(c.name, c.routeName)}>{c.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <span className='quick-search__btn ccc' onClick={onAccept}>Пошук</span>
        </div>
    )
});

export default QuickSearch