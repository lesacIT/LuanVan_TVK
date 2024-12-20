import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';

import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { useGetMyEnquiriesQuery } from '../slices/enquiriesSlice';
import { setCredentials } from '../slices/authSlice';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ProfileScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: orders,
    isLoading: orderLoading,
    error: orderError,
  } = useGetMyOrdersQuery();
  const {
    data: enquiries,
    isLoading: enquiryLoading,
    error: enquiryError,
  } = useGetMyEnquiriesQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setAddress(userInfo.address);
    setMobile(userInfo.mobile);
  }, [userInfo.email, userInfo.name, userInfo.address, userInfo.mobile]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();

    // Kiểm tra xem mật khẩu được nhập và trường nào không được nhập
    const fieldsToUpdate = {
      name,
      email,
      address,
      mobile,
    };

    let isValid = true;

    // Kiểm tra các trường bắt buộc
    Object.entries(fieldsToUpdate).forEach(([field, value]) => {
      if (!value) {
        toast.error(`Vui lòng nhập ${field}`);
        isValid = false;
      }
    });

    // Kiểm tra độ dài tối thiểu của tên và mật khẩu
    if (name.length < 4) {
      toast.error('Tên phải có ít nhất 4 ký tự');
      isValid = false;
    }

    // Kiểm tra tính hợp lệ của email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ');
      isValid = false;
    }

    // Kiểm tra tính hợp lệ của số điện thoại
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobile)) {
      toast.error('Số điện thoại không hợp lệ');
      isValid = false;
    }

    // Kiểm tra mật khẩu nếu người dùng muốn cập nhật
    if (password !== '' || confirmPassword !== '') {
      if (password !== confirmPassword) {
        toast.error('Mật khẩu không khớp');
        isValid = false;
      }

      if (password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự');
        isValid = false;
      }

      // Nếu mật khẩu không hợp lệ, không cần tiếp tục thực hiện
      if (!isValid) {
        return;
      }
    } else {
      // Nếu người dùng không muốn cập nhật mật khẩu, loại bỏ nó khỏi các trường cập nhật
      delete fieldsToUpdate.password;
    }

    if (isValid) {
      try {
        const res = await updateProfile(fieldsToUpdate).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Cập nhật thông tin thành công');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title={'Trang Cá Nhân'} />
      <BreadCrumb title='Trang Cá Nhân' />
      <Row className='mt-2'>
        <h4 className='text-black'>THÔNG TIN NGƯỜI DÙNG</h4>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group className='my-2' controlId='name'>
                <Form.Label className='text-black'>Tên</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Nhập tên'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className='my-2' controlId='email'>
                <Form.Label className='text-black'>Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Nhập email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className='my-2' controlId='address'>
                <Form.Label className='text-black'>Địa chỉ</Form.Label>
                <Form.Control
                  type='address'
                  placeholder='Nhập địa chỉ'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='my-2' controlId='mobile'>
                <Form.Label className='text-black'>Số điện thoại</Form.Label>
                <Form.Control
                  type='tel'
                  placeholder='Nhập số điện thoại'
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className='my-2' controlId='password'>
                <Form.Label className='text-black'>Đổi mật khẩu</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Nhập mật khẩu'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className='my-2' controlId='confirmPassword'>
                <Form.Label className='text-black'>Xác nhận lại mật khẩu</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Nhập lại mật khẩu'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <div className='text-end'>
                <Button type='submit' className='button my-3'>
                  Cập nhật
                </Button>
              </div>

              {loadingUpdateProfile && <Loader />}
            </Col>
          </Row>
        </Form>
      </Row>
      <Row className='mb-5'>
        <Col md={12}>
          <Row className='mb-5'>
            <h4 className='text-black'>ĐƠN HÀNG CỦA TÔI</h4>
            {orderLoading ? (
              <Loader />
            ) : orderError ? (
              <Message variant='danger'>
                {orderError?.data?.message || orderError.error}
              </Message>
            ) : (
              <Table striped hover responsive className='table-sm'>
                <thead className='text-black'>
                  <tr>
                    <th>STT</th>
                    <th>MÃ ĐƠN</th>
                    <th>NGÀY ĐẶT</th>
                    <th>TỔNG TIỀN</th>
                    <th>ĐÃ THANH TOÁN</th>
                    <th>ĐÃ XÁC NHẬN</th>
                    <th>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td>
                        {order.createdAt ? (
                          new Date(order.createdAt).toLocaleDateString('vi-VN')
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        {order.totalPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                        VNĐ
                      </td>
                      <td>
                        {order.isPaid ? (
                          new Date(order.paidAt).toLocaleDateString('vi-VN')
                        ) : (
                          // <FaCheck style={{ color: 'green' }} />
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          new Date(order.deliveredAt).toLocaleDateString(
                            'vi-VN'
                          )
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        <LinkContainer
                          to={`/${
                            order.paymentMethod === 'VNPay'
                              ? 'order'
                              : 'ordercod'
                          }/${order._id}`}
                        >
                          <Button
                            variant='light'
                            className='btn-sm btn details'
                          >
                            Xem chi tiết
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Row>
          <Row className='mb-5'>
            <h4 className='text-black mt-3'>YÊU CẦU ĐÃ GỬI</h4>
            {enquiryLoading ? (
              <Loader />
            ) : enquiryError ? (
              <Message variant='danger'>
                {enquiryError?.data?.message || enquiryError.error}
              </Message>
            ) : (
              <Table striped hover responsive className='table-sm'>
                <thead className='text-black'>
                  <tr>
                    <th>STT</th>
                    <th>THỜI GIAN</th>
                    <th>TÊN</th>
                    <th>EMAIL</th>
                    <th>SỐ ĐIỆN THOẠI</th>
                    <th>NỘI DUNG</th>
                    <th>TRẠNG THÁI</th>
                    <th>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry, index) => (
                    <tr key={enquiry._id}>
                      <td>{index + 1}</td>
                      <td>
                        {enquiry.createdAt ? (
                          <span>
                            {format(
                              new Date(enquiry.createdAt),
                              'do MMMM yyyy',
                              { locale: vi }
                            )}
                          </span>
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>{enquiry.name}</td>
                      <td>{enquiry.email}</td>
                      <td>{enquiry.mobile}</td>
                      <td>
                        <p
                          className='desc'
                          dangerouslySetInnerHTML={{
                            __html: enquiry.comment
                              ? enquiry.comment.substr(0, 10) + '...'
                              : '',
                          }}
                        ></p>
                      </td>
                      <td>{enquiry.status}</td>
                      <td>
                        <LinkContainer to={`/enquiry/${enquiry._id}`}>
                          <Button
                            variant='light'
                            className='btn-sm btn details'
                          >
                            Xem chi tiết
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
