import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import MultiRangeSlider from '../../../../lib/components/MultiRangeSlider/MultiRangeSlider';
import filtersStore from '../../../../stores/filters/filters.store';
import { ICategory } from '../../../../types/magento/ICategory';
import FilterItem from '../Filters/FilterItem/FilterItem'

interface ProductFiltersProps {
  category: ICategory;
}

const ProductFilters: FC<ProductFiltersProps> = observer(({ category }) => {

  const onCheck = (attributeCode: string, value: string, checked: boolean) => {
    filtersStore.selectFilter(attributeCode, value, checked);
  }

  const onChangeRange = ({ min, max }: { min: number, max: number }) => {
    filtersStore.changePriceRange(min, max);
  }

  return (
    <div className='filters__content'>
      <div className='filters__title'>{category?.name}</div>
      <div className='filters__line'></div>
      <div className='filters__attr-name'>Ціна</div>
      <div className='filters__price'>
        {filtersStore.status == 'success' && (
          <MultiRangeSlider
            min={filtersStore.priceRange.min}
            max={filtersStore.priceRange.max}
            selectedMin={filtersStore.selectedPriceRange.min}
            selectedMax={filtersStore.selectedPriceRange.max}
            onChange={(min, max) => { }}
            onAccept={(min, max) => onChangeRange({ min, max })}
          />
        )}
      </div>

      {filtersStore.filters.map(filter => (
        <FilterItem
          key={filter.attribute_code}
          displayFilter={filter}
          onCheck={onCheck}
        />
      ))}
    </div>
  )
});

export default ProductFilters