import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetEnquiryDetailsQuery } from '../slices/enquiriesSlice';
import { IoArrowBack } from 'react-icons/io5';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const EnquiryDetails = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id: enquiryId } = useParams();
  const {
    data: enquiry,
    refetch,
    isLoading,
    error,
  } = useGetEnquiryDetailsQuery(enquiryId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Meta title={'Chi Tiết Yêu Cầu'} />
      <BreadCrumb title={'Chi Tiết Yêu Cầu'} />
      <Link to='/profile'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <div className='d-flex justify-content-center align-items-center'>
        <div className='bg-white mt-2 mb-5 p-4 rounded-3 enquiry-inner-wrapper'>
          <h4 className='title mb-4 text-center text-black'>
            CHI TIẾT YÊU CẦU
          </h4>
          <div className='d-flex align-items-center mb-3'>
            <h6 className='me-3 text-black'>THỜI GIAN:</h6>
            <p>
              <span>
                {format(new Date(enquiry.createdAt), 'HH:mm:ss, do MMMM yyyy', {
                  locale: vi,
                })}
              </span>
            </p>
          </div>
          <div className='d-flex align-items-center mb-3'>
            <h6 className='me-3 text-black'>TÊN:</h6>
            <p>{enquiry && enquiry.name}</p>
          </div>
          <div className='d-flex align-items-center mb-3'>
            <h6 className='me-3 text-black'>SỐ ĐIỆN THOẠI:</h6>
            <p>{enquiry && enquiry.mobile}</p>
          </div>
          <div className='d-flex align-items-center mb-3'>
            <h6 className='me-3 text-black'>EMAIL:</h6>
            <p>
              <a
                className='custom-link'
                href={`mailto:${enquiry && enquiry.email}`}
              >
                {enquiry && enquiry.email}
              </a>
            </p>
          </div>
          <div className='d-flex align-items-center mb-3'>
            <h6 className='me-3 text-black'>NỘI DUNG:</h6>
            <p>{enquiry && enquiry.comment}</p>
          </div>
          <div className='d-flex align-items-center mb-3'>
            <h6 className='me-3 text-black'>TRẠNG THÁI:</h6>
            <p>{enquiry && enquiry.status}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryDetails;
