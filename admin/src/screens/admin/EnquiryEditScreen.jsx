import {
  useUpdateEnquiryMutation,
  useGetEnquiryDetailsQuery,
} from '../../slices/enquiriesSlice';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { IoArrowBack } from 'react-icons/io5';
import { Row, Col } from 'react-bootstrap';
import FormContainer from '../../components/FormContainer';

const EnquiryEditScreen = () => {
  const { id: enquiryId } = useParams();
  const [status, setStatus] = useState('');
  const {
    data: enquiry,
    isLoading,
    refetch,
    error,
  } = useGetEnquiryDetailsQuery(enquiryId);

  const [updateEnquiry, { isLoading: loadingUpdate }] =
    useUpdateEnquiryMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (enquiry) {
      setStatus(enquiry.status);
    }
  }, [enquiry]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateEnquiry({
        enquiryId,
        status,
      }).unwrap();
      toast.success('Đã cập nhật trạng thái');
      refetch();
      navigate('/admin/enquirylist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <Row className='align-items-center'>
        <Col>
          <Link to='/admin/enquirylist'>
            <IoArrowBack className='icon-container' size={30} />
          </Link>
        </Col>
      </Row>

      <div className='d-flex justify-content-center align-items-center'>
        <h3 className='text-black text-center'>CHI TIẾT YÊU CẦU</h3>
      </div>
      <div className='bg-white p-4 rounded-3'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='mb-3'>
              <h6 className='mb-0 text-black'>Ngày gửi:</h6>
              <p className='mb-0'>
                {enquiry && enquiry.createdAt.substring(0, 10)}
              </p>
            </div>
            <div className='mb-3'>
              <h6 className='mb-0 text-black'>Tên khách hàng:</h6>
              <p className='mb-0'>{enquiry && enquiry.name}</p>
            </div>
            <div className='mb-3'>
              <h6 className='mb-0 text-black'>Số điện thoại:</h6>
              <p className='mb-0'>{enquiry && enquiry.mobile}</p>
            </div>
            <div className='mb-3'>
              <h6 className='mb-0 text-black'>Email:</h6>
              <p className='mb-0'>{enquiry && enquiry.email}</p>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='mb-3'>
              <h6 className='mb-0 text-black'>Nội dung:</h6>
              <p className='mb-0'>{enquiry && enquiry.comment}</p>
            </div>
            <div className='mb-3'>
              <h6 className='mb-0 text-black'>Trạng thái:</h6>
              <p className='mb-0'>{enquiry && enquiry.status}</p>
            </div>
            <div className='mb-3'>
              <h6 className='mb-0 text-black'>Đổi trạng thái:</h6>
              <div>
                <select
                  name=''
                  value={status}
                  className='form-control form-select'
                  id=''
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value='Đã gửi'>Đã gửi</option>
                  <option value='Đã liên hệ'>Đã liên hệ</option>
                  <option value='Đang giải quyết'>Đang giải quyết</option>
                  <option value='Đã giải quyết'>Đã giải quyết</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='text-end'>
        <button onClick={submitHandler} className='btn button my-4'>
          Lưu
        </button>
      </div>
    </div>
  );
};

export default EnquiryEditScreen;
