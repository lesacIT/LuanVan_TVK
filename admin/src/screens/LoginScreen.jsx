import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Container from '../components/Container';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

import Meta from '../components/Meta';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await schema.validate({ email, password }, { abortEarly: false });
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        let errors = {};
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);
        // Hiển thị thông báo lỗi ngay tại đây
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  

  return (
    <>
      <Meta title={'Đăng Nhập'} />

      <Container class1='login-wrapper'>
        <div className='row' style={{ marginTop: '100px' }}>
          <div className='col-7'>
            <img
              width={650}
              src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1714364965/Customer-Service-Illustration_pnvonj.jpg'
            ></img>
          </div>
          <div className='col-5'>
            <div class='card1'>
              <div class='bg1'>
                <h4 className='text-center mt-5 text-black'>
                  ĐĂNG NHẬP QUẢN TRỊ
                </h4>
                <Container>
                  <Form
                    onSubmit={submitHandler}
                    className='d-flex flex-column gap-15'
                  >
                    <Form.Group className='' controlId='email'>
                      <Form.Label className='text-black'>Email</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Nhập email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!validationErrors.email}
                      ></Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {validationErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className='' controlId='password'>
                      <Form.Label className='text-black'>Mật khẩu</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder='Nhập mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!validationErrors.password}
                      ></Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {validationErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      disabled={isLoading}
                      type='submit'
                      className='button mt-3 mb-1'
                    >
                      Đăng nhập
                    </Button>
                    {isLoading && <Loader />}
                  </Form>
                </Container>
              </div>
              <div class='blob1'></div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default LoginScreen;
