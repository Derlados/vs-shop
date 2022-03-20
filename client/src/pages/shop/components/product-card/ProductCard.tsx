import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import cart from '../../../../store/cart';
import { IProduct } from '../../../../types/types'
import ProductLargeCard from './ProductLargeCard';
import ProductQuickModal from './ProductQuickModal';
import ProductSmallCard from './ProductSmallCard';

export interface ProductProps {
    product: IProduct;
    addToCart: (product: IProduct, count?: number) => void;
    addToFavorite: (product: IProduct) => void;
}

export interface ProductCardProps extends ProductProps {
    openFullView: (product: IProduct) => void;
    onOpenQuickView: (product: IProduct) => void;
}

interface CreateProductCardProps extends ProductCardProps {
    type: "small" | "large";
}

const ProductCard: FC<CreateProductCardProps> = observer(({ type, product, openFullView, addToCart, addToFavorite, onOpenQuickView }) => {

    switch (type) {
        case "small": {
            return (
                <ProductSmallCard
                    product={product}
                    addToCart={addToCart}
                    addToFavorite={addToFavorite}
                    openFullView={openFullView}
                    onOpenQuickView={onOpenQuickView}
                />
            )
        }
        case "large": {
            return (
                <ProductLargeCard
                    product={product}
                    addToCart={addToCart}
                    addToFavorite={addToFavorite}
                    openFullView={openFullView}
                    onOpenQuickView={onOpenQuickView}
                />
            )
        }
    }
});

export default ProductCard