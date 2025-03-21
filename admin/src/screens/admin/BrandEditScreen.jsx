import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetBrandDetailsQuery,
  useUpdateBrandMutation,
} from '../../slices/brandsApiSlice';
import { IoArrowBack } from 'react-icons/io5';

const BrandEditScreen = () => {
  const { id: brandId } = useParams();
  const [title, setTitle] = useState('');

  const {
    data: brand,
    isLoading,
    refetch,
    error,
  } = useGetBrandDetailsQuery(brandId);

  const [updateBrand, { isLoading: loadingUpdate }] = useUpdateBrandMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu trường 'title' không được điền vào
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên thương hiệu');
      return;
    }
    try {
      await updateBrand({
        brandId,
        title,
      }).unwrap(); // Unwrap the Promise to catch any rejection in the catch block
      toast.success('Đã cập nhật thương hiệu');
      refetch();
      navigate('/admin/brandlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (brand) {
      setTitle(brand.title);
    }
  }, [brand]);

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
        <h3 className='text-black text-center'>CHỈNH SỬA THƯƠNG HIỆU</h3>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='title'>
              <Form.Label className='text-black'>Tên thương hiệu</Form.Label>
              <Form.Control
                type='text'
                placeholder='Nhập tên thương hiệu'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Container className='text-center'>
              <Button
                type='submit'
                className='button my-4'
                style={{ marginTop: '1rem' }}
              >
                Cập nhật
              </Button>
            </Container>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default BrandEditScreen;
