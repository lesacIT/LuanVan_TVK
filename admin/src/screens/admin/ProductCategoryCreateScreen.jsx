import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { IoArrowBack } from "react-icons/io5";
import { toast } from 'react-toastify';
import { useCreateProductCategoryMutation } from '../../slices/pcategoryApiSlice';

const ProductCategoryCreateScreen = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createProductCategory] = useCreateProductCategoryMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Kiểm tra nếu trường 'title' không được điền vào
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên danh mục sản phẩm');
      return;
    }
  
    setLoading(true);
    try {
      const res = await createProductCategory({ title }).unwrap();
      toast.success('Đã tạo phân loại');
      navigate(`/admin/productcategorylist`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    setLoading(false);
  };
  

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
        <h4 className='text-black text-center'>THÊM DANH MỤC</h4>
        {loading && <Loader />}
        {error && <Message variant='danger'>{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='title'>
            <Form.Label className='text-black'>Tên danh mục sản phẩm</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập tên danh mục sản phẩm'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Container className='text-center'>
            <Button type='submit' className='button my-3'>
              Tạo danh mục
            </Button>
          </Container>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductCategoryCreateScreen;
