import { useState, useCallback } from 'react';
import { getCartList, addToCart as addToCartApi, updateCartQuantity as updateQtyApi, deleteCartItem as deleteItemApi } from '../ServiceCustmer/Cart/CartApi';

export const useCart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCartList();
      setCartData(res);
    } catch {
      setCartData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, sellerId, quantity = 1) => {
    return addToCartApi(productId, sellerId, quantity);
  }, []);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    return updateQtyApi(cartItemId, quantity);
  }, []);

  const deleteItem = useCallback(async (cartItemId) => {
    return deleteItemApi(cartItemId);
  }, []);

  return { cartData, loading, fetchCart, addToCart, updateQuantity, deleteItem };
};
