import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FC, useEffect, useRef } from 'react'
import filtersStore from '../../../../../stores/filters/filters.store';
import { IDisplayFilter } from '../../../../../types/magento/IDisplayFilter';

interface FilterItemProps {
  displayFilter: IDisplayFilter;
  onCheck: (attributeCode: string, value: string, checked: boolean) => void;
}

interface LocalStore {
  currentHeight: number | string;
  maxHeight: number;
}

const FilterItem: FC<FilterItemProps> = observer(({ displayFilter, onCheck }) => {
  const ref = useRef<HTMLUListElement>(null);
  const localStore = useLocalObservable<LocalStore>(() => ({
    currentHeight: 'max-content',
    maxHeight: -1
  }))

  useEffect(() => {
    localStore.maxHeight = ref.current?.clientHeight ?? 0
    localStore.currentHeight = 0;
  }, [])

  const toggleList = () => {
    localStore.currentHeight = localStore.currentHeight === 0 ? localStore.maxHeight : 0
  }

  const isChecked = (attributeCode: string, value: string) => {
    const filter = filtersStore.selectedFilters.find(f => f.attributeCode === attributeCode);
    return filter?.values.includes(value) ?? false;
  }

  return (
    <div className='filters__attr' >
      <div 
        className='filters__attr-name filters__attr-name_touchable text text_xlarge' 
        onClick={toggleList}
      >
        {displayFilter.frontend_label}
      </div>
      <ul ref={ref} className='filters__attr-list' style={{
        height: localStore.currentHeight
      }}>
        {displayFilter.values.map(value => (
          <li key={value.value} className={classNames('filters__attr-item rlc', {
            'filters__attr-item_disable': false
          })}>
            <label className='filters__attr-value text text_small rcc'>
              {`${value.value} (${value.count})`}
              <input className='filters__checkbox'
                type="checkbox"
                checked={isChecked(displayFilter.attribute_code, value.value)}
                onChange={(e) => onCheck(displayFilter.attribute_code, value.value, e.target.checked)}
              />
              <span className='filters__checkmark'></span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
});

export default FilterItem