// import { createSlice } from '@reduxjs/toolkit';
// import { VNPAY_URL } from '../constants';

// const initialState = {
//   vnpayUrl: null,
//   loading: false,
//   error: null,
// };

// const paymentSlice = createSlice({
//   name: 'payment',
//   initialState,
//   reducers: {
//     setVnpayUrl(state, action) {
//       state.vnpayUrl = action.payload;
//     },
//     setLoading(state, action) {
//       state.loading = action.payload;
//     },
//     setError(state, action) {
//       state.error = action.payload;
//     },
//     clearError(state) {
//       state.error = null;
//     },
//   },
// });

// export const { setVnpayUrl, setLoading, setError, clearError } = paymentSlice.actions;

// export const fetchVnpayUrl = (amount, bankCode, orderDescription, orderType) => async (dispatch) => {
//   dispatch(setLoading(true));
//   try {
//     const response = await fetch(`${VNPAY_URL}?vnpayAmount=${amount}&bankCode=${bankCode}&orderDescription=${orderDescription}&orderType=${orderType}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch VNPay URL');
//     }
//     const data = await response.json();
//     dispatch(setVnpayUrl(data));
//   } catch (error) {
//     dispatch(setError(error.message));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export default paymentSlice.reducer;