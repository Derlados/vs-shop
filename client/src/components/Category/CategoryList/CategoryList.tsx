import { FC } from 'react'
import CategoryCard from './CategoryCard';
import './category-list.scss';
import { ICategoryList } from '../../../types/magento/ICategoryList';
import catalogStore from '../../../stores/catalog/catalog.store';
import { ICategory } from '../../../types/magento/ICategory';


interface CategoryListProps {
  categories: ICategory[];
  onClick?: (categoryId: number) => void;
}

const CategoryList: FC<CategoryListProps> = ({ categories, onClick }) => {
  return (
    <div className='category-list rlc'>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={onClick ? () => onClick(category.id) : undefined}
          poductsCount={catalogStore.getCategoryProductsCount(category.id)} />
      ))}
      {categories.length % 3 == 2 &&
        <div className='category-list__category-card category-list__category-card_empty  rlc' />
      }
    </div>
  )
}

export default CategoryList