import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ChangeEvent, KeyboardEvent, FC } from 'react'
import { ICategoryList } from '../../../types/magento/ICategoryList';
import './quick-search.scss';

interface QuickSearchProps {
  value: string;
  catalogs: ICategoryList[];
  onFocus: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAccept: () => void;
  onSelectCategory: (categoryId: number) => void;
}

interface State {
  isOpenCategories: boolean;
  selectedCategory: string;
}

const ALL_CATEGORIES = 'Всі категорії';

const QuickSearch: FC<QuickSearchProps> = observer(({ value, catalogs, onFocus: onFocusChange, onChange, onAccept, onSelectCategory }) => {
  const state = useLocalObservable<State>(() => ({
    isOpenCategories: false,
    selectedCategory: ALL_CATEGORIES
  }))

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onAccept();
    }
  }

  const onSelect = (categoryName: string, categoryId: number) => {
    state.selectedCategory = categoryName;
    state.isOpenCategories = false;
    onSelectCategory(categoryId);
  }

  const toggleList = () => {
    state.isOpenCategories = !state.isOpenCategories;
  }

  return (
    <div className='quick-search quick-search_full-screen rcc'>
      <div className='quick-search__input-wrapper rcc'>
        <div className='quick-search__icon quick-search__icon_search'></div>
        <input
          onFocus={onFocusChange}
          className='quick-search__input'
          placeholder='Хочу знайти ...'
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
        />
        <div className='quick-search__categories'>
          <div
            className={classNames('quick-search__selected-category', {
              'quick-search__selected-category_open': state.isOpenCategories
            })}
            onClick={toggleList}
          >
            {state.selectedCategory}
          </div>
          <ul className={classNames('quick-search__category-list', {
            'quick-search__category-list_open': state.isOpenCategories
          })}>
            <li
              className='quick-search__category-item'
              onClick={() => onSelect(ALL_CATEGORIES, -1)}
            >
              {ALL_CATEGORIES}
            </li>
            {catalogs.map(c => (
              <ul key={c.id} className='quick-search__catalog-categories-list'>
                <li className='quick-search__category-item quick-search__category-item_untouchable'>{c.name}</li>
                {c.children_data.map(category => (
                  <li
                    key={category.id}
                    className='quick-search__category-item'
                    onClick={() => onSelect(category.name, category.id)}
                  >
                    - - {category.name}
                  </li>
                ))}
              </ul>

            ))}
          </ul>
        </div>
      </div>
      <span className='quick-search__btn ccc' onClick={onAccept}>
        Пошук
      </span>
    </div>
  )
});

export default QuickSearch