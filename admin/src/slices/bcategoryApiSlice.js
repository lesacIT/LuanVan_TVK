import { apiSlice } from './apiSlice';
import { BLOGCATEGORIES_URL } from '../constants'; 

export const bcategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBlogCategory: builder.mutation({
      query: (data) => ({
        url: `${BLOGCATEGORIES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BlogCategory'],
    }),
    getBlogCategoryDetails: builder.query({
      query: (blogcategoryId) => ({
        url: `${BLOGCATEGORIES_URL}/${blogcategoryId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateBlogCategory: builder.mutation({
      query: (data) => ({
        url: `${BLOGCATEGORIES_URL}/${data.blogcategoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BlogCategories'],
    }),
    deleteBlogCategory: builder.mutation({
      query: (blogcategoryId) => ({
        url: `${BLOGCATEGORIES_URL}/${blogcategoryId}`,
        method: 'DELETE',
      }),
      providesTags: ['BlogCategory'],
    }),
    getBlogCategories: builder.query({
      query: () => ({
        url: BLOGCATEGORIES_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateBlogCategoryMutation,
  useGetBlogCategoryDetailsQuery,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useGetBlogCategoriesQuery,
} = bcategoryApiSlice;
