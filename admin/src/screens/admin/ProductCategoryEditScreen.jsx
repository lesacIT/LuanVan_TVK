import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductCategoryDetailsQuery,
  useUpdateProductCategoryMutation,
} from '../../slices/pcategoryApiSlice';
import { IoArrowBack } from 'react-icons/io5';

const ProductCategoryEditScreen = () => {
  const { id: productcategoryId } = useParams();
  const [title, setTitle] = useState('');

  const {
    data: productcategory,
    isLoading,
    refetch,
    error,
  } = useGetProductCategoryDetailsQuery(productcategoryId);

  const [updateProductCategory, { isLoading: loadingUpdate }] =
    useUpdateProductCategoryMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu trường 'title' không được điền vào
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên danh mục sản phẩm');
      return;
    }

    try {
      await updateProductCategory({
        productcategoryId,
        title,
      }).unwrap(); // Unwrap the Promise to catch any rejection in the catch block
      toast.success('Đã cập nhật phân loại');
      refetch();
      navigate('/admin/productcategorylist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (productcategory) {
      setTitle(productcategory.title);
    }
  }, [productcategory]);

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <Link to='/admin/productcategorylist'>
            <IoArrowBack className='icon-container' size={30} />
          </Link>
        </Col>
      </Row>
      <FormContainer>
        <h3 className='text-black text-center'>CHỈNH SỬA DANH MỤC</h3>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='title'>
              <Form.Label className='text-black'>
                Tên danh mục sản phẩm
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Nhập tên danh mục sản phẩm'
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

export default ProductCategoryEditScreen;
