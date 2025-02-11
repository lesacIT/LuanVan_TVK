import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';
import { IoArrowBack } from "react-icons/io5";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success('Cập nhật thành công');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <Link to='/admin/userlist'>
            <IoArrowBack className='icon-container' size={30} />
          </Link>
        </Col>
      </Row>
      <FormContainer>
        <h4 className='text-black text-center'>
          CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG
        </h4>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label className='text-black'>Tên</Form.Label>
              <Form.Control
                type='name'
                placeholder='Nhập tên'
                value={name}
                readOnly
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='email'>
              <Form.Label className='text-black'>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Nhập email'
                value={email}
                readOnly
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-3' controlId='isadmin'>
              <Form.Check className='text-black'
                type='checkbox'
                label='Phân quyền quản trị'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            <Container className='text-center'>
              <Button type='submit' className='button my-2'>
                Cập nhật
              </Button>
            </Container>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
