import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'VNPay' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const existingItemIndex = state.cartItems.findIndex(
        (x) => x._id === item._id && x.color?._id === item.color?._id
      );

      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, chỉ cập nhật số lượng
        state.cartItems[existingItemIndex].qty = item.qty;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng
        state.cartItems.push(item);
      }

      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      const { id, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => !(item._id === id && item.color?._id === color?._id)
      );
      return updateCart(state);
    },
    
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
