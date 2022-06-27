import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import cart from '../../../../store/cart';
import catalog from '../../../../store/catalog';
import shop from '../../../../store/shop';
import { IImage } from '../../../../types/IImage';
import { IProduct } from '../../../../types/IProduct';
import ProductMainInfo from '../../../product/components/ProductMainInfo';
import ProductLargeCard from './ProductLargeCard';
import ProductSmallCard from './ProductSmallCard';

export interface ProductProps {
    product: IProduct;
    addToCart: (product: IProduct, count?: number) => void;
    getMainImage: (product: IProduct) => IImage;
}

export interface ProductCardProps extends ProductProps {
    onOpenQuickView: (product: IProduct) => void;
    urlFull: string;
}

interface CreateProductCardProps {
    product: IProduct;
    type: "small" | "large" | "quick-view" | "full-view";
    onOpenQuickView?: (IProduct: IProduct) => void;
}

const Product: FC<CreateProductCardProps> = observer(({ type, product, onOpenQuickView = () => { } }) => {
    const { catalog: category } = useParams();

    const addToCart = (product: IProduct, count: number = 1) => {
        cart.addToCart(product, count);
    }

    const getMainImage = (product: IProduct): IImage => {
        return product.images.find(img => img.isMain) ?? product.images[0];
    }

    switch (type) {
        case "small": {
            return (
                <ProductSmallCard
                    product={product}
                    urlFull={`/${category}/${product.id}`}
                    addToCart={addToCart}
                    onOpenQuickView={onOpenQuickView}
                    getMainImage={getMainImage}
                />
            )
        }
        case "large": {
            return (
                <ProductLargeCard
                    product={product}
                    urlFull={`/${category}/${product.id}`}
                    addToCart={addToCart}
                    onOpenQuickView={onOpenQuickView}
                    getMainImage={getMainImage}
                />
            )
        }
        case "quick-view": {
            return (
                <ProductMainInfo
                    product={product}
                    addToCart={addToCart}
                    getMainImage={getMainImage}
                />
            )
        }
        case "full-view": {
            return (
                <ProductMainInfo
                    product={product}
                    addToCart={addToCart}
                    getMainImage={getMainImage}
                    isExtended={true}
                />
            )
        }
    }
});

export default Product