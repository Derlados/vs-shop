import productHelper from "../helpers/product.helper";
import cartStore from "../stores/cart/cart.store";
import catalogStore from "../stores/catalog/catalog.store";
import { IProduct } from "../types/magento/IProduct";

export default function useProduct(product: IProduct) {
  const isInCart = cartStore.cart.items.find(i => i.sku === product.sku) !== undefined;
  const manufacturer = productHelper.getManufacturer(product, catalogStore.manufacturers);
  const mainImage = productHelper.getMainImage(product);
  const description = productHelper.getDescription(product);
  const specialPrice = productHelper.getSpecialPrice(product);
  const productUrl = `/product/${product.sku}`;

  return { manufacturer, mainImage, description, specialPrice, isInCart, productUrl };
}