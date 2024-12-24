  import { createContext } from "react";
  import { IProduct } from "../../types/magento/IProduct";

  interface CartContextProps {
    addToCart: (product: IProduct, qty?: number) => void;
    updateCartItemQty: (product: IProduct, qty: number) => void;
    deleteFromCart: (product: IProduct) => void;
  }

  export const CartContext = createContext<CartContextProps | undefined>(undefined);