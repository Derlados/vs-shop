import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import ProductFullInfo from './ProductFullInfo/ProductFullInfo';
import ProductLargeCard from './ProductLargeCard/ProductLargeCard';
import ProductSmallCard from './ProductSmallCard/ProductSmallCard';
import './product-card.scss';
import { IProduct } from '../../types/magento/IProduct';
import cartStore from '../../stores/cart/cart.store';
import productHelper from '../../helpers/product.helper';
import catalogStore from '../../stores/catalog/catalog.store';

export interface ProductCardProps {
  product: IProduct;
  productUrl: string;
  mainImage: string | undefined;
  specialPrice: number | undefined;
  manufacturer: string | undefined;
  description: string | undefined;
  updateCart: (
    action: "add" | "update" | "delete",
    product: IProduct,
    count?: number
  ) => void;
}


interface CreateProductCardProps {
  product: IProduct;
  containerSize?: "default" | "small";
  type: "small" | "large" | "quick-view" | "full-view";
  onOpenQuickView?: (IProduct: IProduct) => void;
}

const ProductCard: FC<CreateProductCardProps> = observer(({ type, containerSize = "default", product, onOpenQuickView = () => { } }) => {
  const manufacturer = productHelper.getManufacturer(product, catalogStore.manufacturers);
  const mainImage = productHelper.getMainImage(product);
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
        updateCartItemQty(product, qty ?? 1);
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
          urlFull={`/product/${product.sku}`}
          productUrl={`/product/${product.sku}`}
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
          productUrl={`/product/${product.sku}`}
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
          productUrl={`/product/${product.sku}`}
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
          productUrl={`/product/${product.sku}`}
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