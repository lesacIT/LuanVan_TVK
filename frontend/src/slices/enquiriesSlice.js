import { ENQUIRIES_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const enquiriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEnquiries: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: ENQUIRIES_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Enquiries'],
    }),
    getEnquiryDetails: builder.query({
      query: (enquiryId) => ({
        url: `${ENQUIRIES_URL}/${enquiryId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createEnquiry: builder.mutation({
      query: (data) => ({
        url: `${ENQUIRIES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Enquiry'],
    }),
    getMyEnquiries: builder.query({
      query: () => ({
        url: `${ENQUIRIES_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateEnquiry: builder.mutation({
      query: (data) => ({
        url: `${ENQUIRIES_URL}/${data.enquiryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Enquiries'],
    }),
    deleteEnquiry: builder.mutation({
      query: (enquiryId) => ({
        url: `${ENQUIRIES_URL}/${enquiryId}`,
        method: 'DELETE',
      }),
      providesTags: ['Enquiry'],
    }),
  }),
});

export const {
  useGetEnquiriesQuery,
  useGetEnquiryDetailsQuery,
  useCreateEnquiryMutation,
  useUpdateEnquiryMutation,
  useDeleteEnquiryMutation,
  useGetMyEnquiriesQuery,
} = enquiriesApiSlice;
