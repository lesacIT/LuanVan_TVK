import { apiSlice } from './apiSlice';
import { COLORS_URL } from '../constants'; 

export const colorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createColor: builder.mutation({
      query: (data) => ({
        url: `${COLORS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Color'],
    }),
    getColorDetails: builder.query({
      query: (colorId) => ({
        url: `${COLORS_URL}/${colorId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateColor: builder.mutation({
      query: (data) => ({
        url: `${COLORS_URL}/${data.colorId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Colors'],
    }),
    deleteColor: builder.mutation({
      query: (colorId) => ({
        url: `${COLORS_URL}/${colorId}`,
        method: 'DELETE',
      }),
      providesTags: ['Color'],
    }),
    getColors: builder.query({
      query: () => ({
        url: COLORS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateColorMutation,
  useGetColorDetailsQuery,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useGetColorsQuery,
} = colorApiSlice;
