import classNames from 'classnames';
import { FC } from 'react';
import { IProduct } from '../../../types/IProduct';
import Product from './product-card/Product';
import { ViewMode } from './ProductCatalog';
import '../../../styles/shop/catalog.scss';

interface ProductGridProps {
    products: IProduct[];
    viewMode: ViewMode;
    onOpenQuickView?: (product: IProduct) => void;
}

const ProductGrid: FC<ProductGridProps> = ({ products, viewMode, onOpenQuickView = () => { } }) => {

    return (
        <div className={classNames('catalog__products', {
            'rlt': viewMode === ViewMode.GRID,
            'clc': viewMode === ViewMode.LIST
        })}>
            {products.map(product =>
                <div key={product.id} className={classNames('catalog__product-container ccc', {
                    'catalog__product-container_large': viewMode === ViewMode.LIST
                })}>
                    <Product
                        key={product.id}
                        type={viewMode === ViewMode.GRID ? 'small' : 'large'}
                        product={product}
                        onOpenQuickView={onOpenQuickView} />
                </div>
            )}
            {/* Для нормальной работы flex-wrap и space between */}
            {[...Array(4).keys()].map(num => (
                <div key={`empty-${num}`} className={classNames('catalog__product-container ccc', {
                    'catalog__product-container_large': viewMode === ViewMode.LIST
                })}>

                </div>
            ))}
        </div>
    )
}

export default ProductGrid