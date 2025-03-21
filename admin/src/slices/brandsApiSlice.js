import { apiSlice } from './apiSlice';
import { BRANDS_URL } from '../constants'; 

export const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBrand: builder.mutation({
      query: (data) => ({
        url: `${BRANDS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Brand'],
    }),
    getBrandDetails: builder.query({
      query: (brandId) => ({
        url: `${BRANDS_URL}/${brandId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateBrand: builder.mutation({
      query: (data) => ({
        url: `${BRANDS_URL}/${data.brandId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Brands'],
    }),
    deleteBrand: builder.mutation({
      query: (brandId) => ({
        url: `${BRANDS_URL}/${brandId}`,
        method: 'DELETE',
      }),
      providesTags: ['Brand'],
    }),
    getBrands: builder.query({
      query: () => ({
        url: BRANDS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Brands'],
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useGetBrandDetailsQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
} = brandsApiSlice;
