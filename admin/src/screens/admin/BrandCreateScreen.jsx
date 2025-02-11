import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useCreateBrandMutation } from '../../slices/brandsApiSlice';
import { IoArrowBack } from 'react-icons/io5';

const BrandCreateScreen = () => {
  const [title, setTitle] = useState('');
  const [createBrand, { isLoading, error }] = useCreateBrandMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu trường 'title' không được điền vào
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên thương hiệu');
      return;
    }

    try {
      const res = await createBrand({
        title,
      }).unwrap();
      toast.success('Đã tạo thương hiệu');
      navigate(`/admin/brandlist`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <Link to='/admin/brandlist'>
            <IoArrowBack className='icon-container' size={30} />
          </Link>
        </Col>
      </Row>
      <FormContainer>
        <h4 className='text-black text-center'>THÊM THƯƠNG HIỆU</h4>
        {isLoading && <Loader />}
        {error && <Message variant='danger'>{error.data.message}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='title'>
            <Form.Label className='text-black'>Tên thương hiệu</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập tên thương hiệu'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Container className='text-center'>
            <Button type='submit' className='button my-3'>
              Tạo thương hiệu
            </Button>
          </Container>
        </Form>
      </FormContainer>
    </>
  );
};

export default BrandCreateScreen;
