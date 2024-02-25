import { observer } from 'mobx-react-lite';
import { FC } from 'react'
import { useParams } from 'react-router-dom';
import { IImage } from '../../types/IImage';
import ProductFullInfo from './ProductFullInfo/ProductFullInfo';
import ProductLargeCard from './ProductLargeCard/ProductLargeCard';
import ProductSmallCard from './ProductSmallCard/ProductSmallCard';
import './product-card.scss';
import { IProduct } from '../../types/magento/IProduct';
import cartStore from '../../magento_stores/cart/cart.store';
import catalogStore from '../../magento_stores/catalog/catalog.store';
import productHelper from '../../helpers/product.helper';

export interface ProductCardProps {
    product: IProduct;
    updateCart: (
        action: "add" | "update" | "delete",
        product: IProduct,
        count?: number
    ) => void;
    mainImage: string | undefined;
    specialPrice: number | undefined;
    manufacturer: string | undefined;
    description: string | undefined;
}


interface CreateProductCardProps {
    product: IProduct;
    containerSize?: "default" | "small";
    type: "small" | "large" | "quick-view" | "full-view";
    onOpenQuickView?: (IProduct: IProduct) => void;
}

const ProductCard: FC<CreateProductCardProps> = observer(({ type, containerSize = "default", product, onOpenQuickView = () => { } }) => {
    const { catalog: category } = useParams();

    const manufacturer = productHelper.getManufacturer(product, catalogStore.manufacturers);
    const mainImage = product.custom_attributes.find(attr => attr.attribute_code === "thumbnail")?.value as string | undefined;
    const description = productHelper.getDescription(product);
    const specialPrice = productHelper.getSpecialPrice(product);

    const updateCart = (
        action: "add" | "update" | "delete",
        product: IProduct,
        qty?: number
    ) => {
        switch (action) {
            case "add": {
                addToCart(product, qty);
                break;
            }
            case "update": {
                updateCartItemQty(product, qty);
                break;
            }
            case "delete": {
                deleteFromCart(product);
                break;
            }
        }
    }

    const addToCart = (product: IProduct, qty: number = 1) => {
        cartStore.addProduct(product.sku, qty);
    }

    const updateCartItemQty = (product: IProduct, qty: number) => {
        cartStore.updateProduct(product.id, qty);
    }

    const deleteFromCart = (product: IProduct) => {
        cartStore.removeProduct(product.id);
    }

    switch (type) {
        case "small": {
            return (
                <ProductSmallCard
                    product={product}
                    urlFull={`/${category}/${product.sku}`}
                    containerSize={containerSize}
                    updateCart={updateCart}
                    onOpenQuickView={onOpenQuickView}
                    mainImage={mainImage}
                    specialPrice={specialPrice}
                    manufacturer={manufacturer}
                    description={description}
                />
            )
        }
        case "large": {
            return (
                <ProductLargeCard
                    product={product}
                    updateCart={updateCart}
                    onOpenQuickView={onOpenQuickView}
                    mainImage={mainImage}
                    specialPrice={specialPrice}
                    manufacturer={manufacturer}
                    description={description}
                />
            )
        }
        case "quick-view": {
            return (
                <ProductFullInfo
                    product={product}
                    updateCart={updateCart}
                    mainImage={mainImage}
                    specialPrice={specialPrice}
                    manufacturer={manufacturer}
                    description={description}
                />
            )
        }
        case "full-view": {
            return (
                <ProductFullInfo
                    product={product}
                    updateCart={updateCart}
                    isExtended={true}
                    mainImage={mainImage}
                    specialPrice={specialPrice}
                    manufacturer={manufacturer}
                    description={description}
                />
            )
        }
    }
});

export default ProductCard