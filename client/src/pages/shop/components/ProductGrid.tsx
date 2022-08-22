import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { IProduct } from '../../../types/IProduct';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { ViewMode } from './ProductCatalog/ProductCatalog';
import Pagination from '../../../lib/components/Pagination/Pagination';
import { observer, useLocalObservable } from 'mobx-react-lite';

interface ProductGridProps {
    products: IProduct[];
    viewMode: ViewMode;
    maxPerPage: number;
    onSelectProduct?: (product: IProduct) => void;
    onOpenQuickView?: (product: IProduct) => void;
}

interface LocalStore {
    selectedPage: number;
    maxPages: number;
    selectedProducts: IProduct[];
}

const ProductGrid: FC<ProductGridProps> = observer(({ products, viewMode, maxPerPage = 16, onSelectProduct, onOpenQuickView = () => { } }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        selectedPage: 1,
        maxPages: 1,
        selectedProducts: []
    }))

    useEffect(() => {
        let maxPages: number = Math.floor(products.length / maxPerPage);
        if (products.length % maxPerPage !== 0) {
            ++maxPages;
        }
        localStore.maxPages = maxPages;
    }, [products.length])


    const backPage = () => {
        if (localStore.selectedPage !== 1) {
            --localStore.selectedPage;
        }
    }

    const nextPage = () => {
        if (localStore.selectedPage !== localStore.maxPages) {
            ++localStore.selectedPage;
        }
    }

    const selectPage = (page: number) => {
        localStore.selectedPage = page;
    }

    const getSelectedProducts = () => {
        return products.slice((localStore.selectedPage - 1) * maxPerPage, localStore.selectedPage * maxPerPage);
    }

    return (
        <div className='ccc catalog__product-grid-cont' >
            <div className={classNames('catalog__products-grid', {
                'rlt': viewMode === ViewMode.GRID,
                'clc': viewMode === ViewMode.LIST
            })}>
                {getSelectedProducts().map(product =>
                    <div key={product.id} className={classNames('catalog__product-container ccc', {
                        'catalog__product-container_large': viewMode === ViewMode.LIST,
                        'catalog__product-container_inactive-links': onSelectProduct !== undefined
                    })} onClick={onSelectProduct ? () => onSelectProduct(product) : () => { }}>
                        <ProductCard
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
            {localStore.maxPages > 1 &&
                <Pagination
                    maxPages={localStore.maxPages}
                    currentPage={localStore.selectedPage}
                    back={backPage}
                    next={nextPage}
                    setPage={selectPage} />
            }
        </div>
    )
})

export default ProductGrid