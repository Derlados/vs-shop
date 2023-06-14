import { observer } from 'mobx-react-lite';
import { FC } from 'react'
import { useParams } from 'react-router-dom';
import cart from '../../store/cart/cart';
import { IImage } from '../../types/IImage';
import { IProduct } from '../../types/IProduct';
import ProductFullInfo from './ProductFullInfo/ProductFullInfo';
import ProductLargeCard from './ProductLargeCard/ProductLargeCard';
import ProductSmallCard from './ProductSmallCard/ProductSmallCard';
import './product-card.scss';

export interface ProductCardProps {
    product: IProduct;
    addToCart: (product: IProduct, count?: number) => void;
    getMainImage: (product: IProduct) => IImage;
}

export interface SimpleProductCardProps extends ProductCardProps {
    containerSize?: "default" | "small";
    onOpenQuickView: (product: IProduct) => void;
    urlFull: string;
}

interface CreateProductCardProps {
    product: IProduct;
    containerSize?: "default" | "small";
    type: "small" | "large" | "quick-view" | "full-view";
    onOpenQuickView?: (IProduct: IProduct) => void;
}

const ProductCard: FC<CreateProductCardProps> = observer(({ type, containerSize = "default", product, onOpenQuickView = () => { } }) => {
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
                    containerSize={containerSize}
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
                    containerSize={containerSize}
                    addToCart={addToCart}
                    onOpenQuickView={onOpenQuickView}
                    getMainImage={getMainImage}
                />
            )
        }
        case "quick-view": {
            return (
                <ProductFullInfo
                    product={product}
                    addToCart={addToCart}
                    getMainImage={getMainImage}
                />
            )
        }
        case "full-view": {
            return (
                <ProductFullInfo
                    product={product}
                    addToCart={addToCart}
                    getMainImage={getMainImage}
                    isExtended={true}
                />
            )
        }
    }
});

export default ProductCard