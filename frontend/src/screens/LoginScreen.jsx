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
import BreadCrumb from '../components/BreadCrumb';

import * as Yup from 'yup';
const loginSchema = Yup.object().shape({
  email: Yup.string().required('Vui lòng nhập email').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
  password: Yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      // Validate input using Yup schema
      await loginSchema.validate({ email, password }, { abortEarly: false });

      // If validation succeeds, proceed with login
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Đăng nhập thành công');
      navigate(redirect);
    } catch (err) {
      // If validation fails, display error messages
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          // Hiển thị thông báo lỗi bên dưới trường nhập liệu tương ứng
          document.getElementById(`${error.path}-error`).innerText =
            error.message;
        });
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title={'Đăng Nhập'} />
      <BreadCrumb title={'Đăng Nhập'} />

      <Container class1='login-wrapper mt-2 mb-4'>
        <div className='row'>
          <div className='col-8'>
            <img
              width={800}
              src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713687861/a-young-happy-woman-works-on-a-laptop-autumn-workplace-interior-design-vector_ubfkic.jpg'
            ></img>
          </div>
          <div className='col-4'>
            <div class='card1'>
              <div class='bg1'>
                <h4 className='text-center mt-4 text-black'>ĐĂNG NHẬP</h4>
                <Container>
                  <Form
                    onSubmit={submitHandler}
                    className='d-flex flex-column gap-15'
                  >
                    <Form.Group className='my-1' controlId='email'>
                      <Form.Label className='text-black'>Email</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Nhập email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      ></Form.Control>
                      <div id='email-error' className='error-message'></div>{' '}
                    </Form.Group>

                    <Form.Group className='my-1' controlId='password'>
                      <Form.Label className='text-black'>Mật khẩu</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder='Nhập mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      ></Form.Control>
                      <div id='password-error' className='error-message'></div>{' '}
                    </Form.Group>

                    <Button
                      disabled={isLoading}
                      type='submit'
                      className='button my-2'
                    >
                      Đăng nhập
                    </Button>

                    {isLoading && <Loader />}
                  </Form>
                  <Row className='py-3'>
                    <Col>
                      Chưa có tài khoản?{' '}
                      <Link
                        className='custom-link'
                        to={
                          redirect
                            ? `/register?redirect=${redirect}`
                            : '/register'
                        }
                      >
                        Đăng ký
                      </Link>
                    </Col>
                  </Row>
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
