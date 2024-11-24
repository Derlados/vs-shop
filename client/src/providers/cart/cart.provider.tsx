import React, { FC, useContext } from "react";
import { IProduct } from "../../types/magento/IProduct";
import cartStore from "../../stores/cart/cart.store";
import { CartContext } from "./cart.context";

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  
  const addToCart = (product: IProduct, qty: number = 1) => {
   cartStore.addProduct(product.sku, qty);
  };

  const updateCartItemQty = (product: IProduct, qty: number) => {
    cartStore.updateProduct(product.id, qty);
  };

  const deleteFromCart = (product: IProduct) => {
    cartStore.removeProduct(product.id);
  };

  return (
    <CartContext.Provider value={{ addToCart, updateCartItemQty, deleteFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
      throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
