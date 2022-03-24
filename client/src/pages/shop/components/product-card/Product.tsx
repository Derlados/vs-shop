import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';
import cart from '../../../../store/cart';
import { IProduct } from '../../../../types/types'
import ProductMainInfo from '../../../product/components/ProductMainInfo';
import ProductLargeCard from './ProductLargeCard';
import ProductQuickModal from './ProductQuickModal';
import ProductSmallCard from './ProductSmallCard';

export interface ProductProps {
    product: IProduct;
    addToCart: (product: IProduct, count?: number) => void;
    addToFavorite: (product: IProduct) => void;
    openFullView: (product: IProduct) => void;
}

export interface ProductCardProps extends ProductProps {
    onOpenQuickView: (product: IProduct) => void;
}

interface CreateProductCardProps {
    product: IProduct;
    type: "small" | "large" | "quick-view" | "full-view";
    onOpenQuickView?: (IProduct: IProduct) => void;
}

const Product: FC<CreateProductCardProps> = observer(({ type, product, onOpenQuickView = () => { } }) => {
    const navigation = useNavigate();

    //TODO
    const openFullView = (product: IProduct) => {
        navigation(`/product/${product.id}`);
    }

    const addToCart = (product: IProduct, count: number = 1) => {
        cart.addToCart(product, count);
    }

    const addToFavorite = (product: IProduct) => {

    }

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
        case "quick-view": {
            return (
                <ProductMainInfo
                    product={product}
                    addToCart={addToCart}
                    addToFavorite={addToFavorite}
                    openFullView={openFullView}
                />
            )
        }
        case "full-view": {
            return (
                <ProductMainInfo
                    product={product}
                    addToCart={addToCart}
                    addToFavorite={addToFavorite}
                    openFullView={openFullView}
                    isExtended={true}
                />
            )
        }
    }
});

export default Product