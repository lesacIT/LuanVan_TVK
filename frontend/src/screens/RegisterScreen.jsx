import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Container from '../components/Container';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';

import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Tên là bắt buộc').min(4, 'Tên phải có ít nhất 4 ký tự'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

const RegisterScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(
        { name, email, password, confirmPassword },
        { abortEarly: false }
      );

      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      if (err.name === 'ValidationError') {
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
      <Meta title={'Đăng Ký'} />
      <BreadCrumb title={'Đăng Ký'} />

      <Container class1='login-wrapper mt-2 mb-4'>
        <div className='row'>
          <div className='col-8'>
            <img
              width={800}
              src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713687861/a-young-happy-woman-works-on-a-laptop-autumn-workplace-interior-design-vector_ubfkic.jpg'
            ></img>
          </div>
          <div className='col-4'>
            <div class='card2'>
              <div class='bg2'>
                <h4 className='text-center mt-4 text-black'>ĐĂNG KÝ</h4>
                <Container>
                  <Form
                    onSubmit={submitHandler}
                    className='d-flex flex-column gap-15'
                  >
                    <Form.Group className='' controlId='name'>
                      <Form.Label className='text-black'>Tên</Form.Label>
                      <Form.Control
                        type='name'
                        placeholder='Nhập tên'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && (
                        <div className='text-danger error-message'>
                          {errors.name}
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className='' controlId='email'>
                      <Form.Label className='text-black'>Email</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Nhập email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <div className='text-danger error-message'>
                          {errors.email}
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className='' controlId='password'>
                      <Form.Label className='text-black'>Mật khẩu</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder='Nhập mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {errors.password && (
                        <div className='text-danger error-message'>
                          {errors.password}
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className='' controlId='confirmPassword'>
                      <Form.Label className='text-black'>
                        Xác nhận mật khẩu
                      </Form.Label>
                      <Form.Control
                        type='password'
                        placeholder='Nhập lại mật khẩu'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {errors.confirmPassword && (
                        <div className='text-danger error-message'>
                          {errors.confirmPassword}
                        </div>
                      )}
                    </Form.Group>

                    <Button
                      disabled={isLoading}
                      type='submit'
                      className='button my-2'
                    >
                      Đăng ký
                    </Button>

                    {isLoading && <Loader />}
                  </Form>

                  <Row className='py-3'>
                    <Col>
                      Đã có tài khoản?{' '}
                      <Link
                        className='custom-link'
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}
                      >
                        Đăng nhập
                      </Link>
                    </Col>
                  </Row>
                </Container>{' '}
              </div>
              <div class='blob2'></div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default RegisterScreen;
