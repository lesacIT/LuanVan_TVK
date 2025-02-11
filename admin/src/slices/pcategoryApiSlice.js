import { apiSlice } from './apiSlice';
import { PRODUCTCATEGORIES_URL } from '../constants'; 

export const pcategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProductCategory: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTCATEGORIES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ProductCategory'],
    }),
    getProductCategoryDetails: builder.query({
      query: (productcategoryId) => ({
        url: `${PRODUCTCATEGORIES_URL}/${productcategoryId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateProductCategory: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTCATEGORIES_URL}/${data.productcategoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ProductCategories'],
    }),
    deleteProductCategory: builder.mutation({
      query: (productcategoryId) => ({
        url: `${PRODUCTCATEGORIES_URL}/${productcategoryId}`,
        method: 'DELETE',
      }),
      providesTags: ['ProductCategory'],
    }),
    getProductCategories: builder.query({
      query: () => ({
        url: PRODUCTCATEGORIES_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateProductCategoryMutation,
  useGetProductCategoryDetailsQuery,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useGetProductCategoriesQuery,
} = pcategoryApiSlice;
