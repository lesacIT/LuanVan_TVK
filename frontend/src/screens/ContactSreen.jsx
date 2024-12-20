import React, { useState, useEffect } from 'react';
import Meta from '../components/Meta';
import { AiOutlineHome, AiOutlineMail } from 'react-icons/ai';
import { BiPhoneCall, BiInfoCircle } from 'react-icons/bi';
import Container from '../components/Container';
import CustomInput from '../components/CustomInput';
import { IoArrowBack } from 'react-icons/io5';
import BreadCrumb from '../components/BreadCrumb';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateEnquiryMutation } from '../slices/enquiriesSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập tên').min(4, 'Tên phải có ít nhất 4 ký tự'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
  mobile: Yup.string()
    .matches(/^(0|\+84)[1-9]\d{8,9}$/, 'Số điện thoại không hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  comment: Yup.string().min(10, 'Lời nhắn phải có ít nhất 10 ký tự').required('Vui lòng nhập lời nhắn'),
});

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [comment, setComment] = useState('');
  const [createEnquiry, { isLoading, error }] = useCreateEnquiryMutation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setMobile(userInfo.mobile);
  }, [userInfo]);

  const createContact = async (formData) => {
    try {
      const response = await createEnquiry(formData).unwrap();
      // Xử lý khi tạo thành công
      toast.success('Yêu cầu của bạn đã được gửi thành công!');
      // Điều hướng đến trang khác, ví dụ: trang chính
      navigate('/profile');
    } catch (error) {
      // Xử lý khi gặp lỗi
      toast.error(error?.data?.message || error.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Validate input using Yup schema
      await contactSchema.validate(
        { name, email, mobile, comment },
        { abortEarly: false }
      );

      // Nếu dữ liệu hợp lệ, xóa các thông báo lỗi
      setErrors({});

      // Gọi hàm tạo yêu cầu
      await createContact({ name, email, mobile, comment });
    } catch (err) {
      // Nếu có lỗi, cập nhật state errors với các thông báo lỗi tương ứng
      if (err instanceof Yup.ValidationError) {
        let validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title={'Liên Hệ'} />
      <BreadCrumb title='Liên Hệ' />
      <Link to='/'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container class1='contact-wrapper py-4'>
        <div className='row'>
          <div className='col-12'>
            <iframe
              title='myFrame'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8414543766194!2d105.76804573997488!3d10.029938972559076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1701005705782!5m2!1svi!2s'
              width='600'
              height='450'
              className='border-0 w-100'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
          <div className='col-12 mt-5'>
            <div className='contact-inner-wrapper d-flex justify-content-between'>
              <div>
                <h3 className='contact-title mb-4 text-black'>Liên hệ</h3>
                <form
                  action=''
                  onSubmit={submitHandler}
                  className='d-flex flex-column gap-15'
                >
                  <CustomInput
                    type='text'
                    className='form-control'
                    placeholder='Tên'
                    name='name'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  {errors.name && (
                    <div className='text-danger error-message'>{errors.name}</div>
                  )}

                  <CustomInput
                    type='email'
                    className='form-control'
                    placeholder='Email'
                    name='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  {errors.email && (
                    <div className='text-danger error-message'>{errors.email}</div>
                  )}

                  <CustomInput
                    type='tel'
                    className='form-control'
                    placeholder='Số điện thoại'
                    name='mobile'
                    onChange={(e) => setMobile(e.target.value)}
                    value={mobile}
                  />
                  {errors.mobile && (
                    <div className='text-danger error-message'>{errors.mobile}</div>
                  )}

                  <div>
                    <textarea
                      className='w-100 form-control'
                      rows='4'
                      placeholder='Lời nhắn'
                      name='comment'
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    ></textarea>
                    {errors.comment && (
                      <div className='text-danger error-message'>{errors.comment}</div>
                    )}
                  </div>
                  <div className='text-end'>
                    <button className='button border-0'>Gửi</button>
                  </div>
                </form>
              </div>
              <div>
                <h4 className='contact-title mb-4 text-black'>
                  Hãy liên hệ với chúng tôi
                </h4>
                <div>
                  <ul className='ps-0'>
                    <li className='mb-3 d-flex gap-15 align-items-center'>
                      <AiOutlineHome className='fs-5' />
                      <address className='mb-0'>
                        Địa chỉ: Đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều,
                        Thành Phố Cần Thơ
                      </address>
                    </li>
                    <li className='mb-3 d-flex gap-15 align-items-center'>
                      <BiPhoneCall className='fs-5' />
                      <a href='tel:+84 946053795'>+84 946053795</a>
                    </li>
                    <li className='mb-3 d-flex gap-15 align-items-center'>
                      <AiOutlineMail className='fs-5' />
                      <a href='mailto:ttech@gmail.com'>tlipstick@gmail.com</a>
                    </li>
                    <li className='mb-3 d-flex gap-15 align-items-center'>
                      <BiInfoCircle className='fs-5' />
                      <p className='mb-0'>Phục vụ 24/7</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Contact;
