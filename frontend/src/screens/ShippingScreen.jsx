import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';

import * as Yup from 'yup';

const ShippingScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [name, setName] = useState(shippingAddress.name || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [mobile, setMobile] = useState(shippingAddress.mobile || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [errors, setErrors] = useState({});

  // Lấy thông tin người dùng từ redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Sử dụng useEffect để thiết lập các giá trị ban đầu từ thông tin người dùng
  useEffect(() => {
    setName(userInfo.name);
    setAddress(userInfo.address);
    setMobile(userInfo.mobile);
  }, [userInfo]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shippingSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập tên').min(4, 'Tên phải có ít nhất 4 ký tự'),
    address: Yup.string().required('Vui lòng nhập địa chỉ'),
    mobile: Yup.string()
      .matches(/^(0|\+84)[1-9]\d{8,9}$/, 'Số điện thoại không hợp lệ')
      .required('Vui lòng nhập số điện thoại'),
    postalCode: Yup.string(),
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Validate input using Yup schema
      await shippingSchema.validate(
        { name, address, mobile, postalCode },
        { abortEarly: false }
      );

      // Nếu dữ liệu hợp lệ, tiến hành lưu thông tin và điều hướng tới trang thanh toán
      dispatch(saveShippingAddress({ name, address, mobile, postalCode }));
      navigate('/payment');
    } catch (err) {
      // Nếu có lỗi, cập nhật state errors với các thông báo lỗi tương ứng
      if (err instanceof Yup.ValidationError) {
        let validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <>
      <Meta title={'Vận Chuyển'} />
      <BreadCrumb title='Vận Chuyển' />
      <Link to='/cart'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h3 className='shipping text-center'>THÔNG TIN VẬN CHUYỂN</h3>

        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='name'>
            <Form.Label className='text-black'>Tên</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập tên'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className='text-danger error-message'>{errors.name}</div>}
          </Form.Group>

          <Form.Group className='my-2' controlId='address'>
            <Form.Label className='text-black'>Địa chỉ</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập địa chỉ'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && (
              <div className='text-danger error-message'>{errors.address}</div>
            )}
          </Form.Group>

          <Form.Group className='my-2' controlId='mobile'>
            <Form.Label className='text-black'>Số điện thoại</Form.Label>
            <Form.Control
              type='tel'
              placeholder='Nhập số điện thoại'
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            {errors.mobile && (
              <div className='text-danger error-message'>{errors.mobile}</div>
            )}
          </Form.Group>

          <Form.Group className='my-2' controlId='postalCode'>
            <Form.Label className='text-black'>
              Mã bưu điện (không bắt buộc)
            </Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập mã bưu điện'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            {errors.postalCode && (
              <div className='text-danger error-message'>{errors.postalCode}</div>
            )}
          </Form.Group>
          <Container className='text-center'>
            <Button className='button my-3' type='submit'>
              Tiếp tục
            </Button>
          </Container>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
