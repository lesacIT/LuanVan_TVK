import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useCreateBlogCategoryMutation } from '../../slices/bcategoryApiSlice';
import { IoArrowBack } from 'react-icons/io5';

const BlogCategoryCreateScreen = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createBlogCategory] = useCreateBlogCategoryMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
     // Kiểm tra nếu trường 'title' không được điền vào
     if (!title.trim()) {
      toast.error('Vui lòng nhập tên chủ đề');
      return;
    }
  
    setLoading(true);
    try {
      const res = await createBlogCategory({ title }).unwrap();
      toast.success('Đã tạo phân loại');
      navigate(`/admin/blogcategorylist`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <Link to='/admin/blogcategorylist'>
            <IoArrowBack className='icon-container' size={30} />
          </Link>
        </Col>
      </Row>
      <FormContainer>
        <h4 className='text-black text-center'>THÊM CHỦ ĐỀ</h4>
        {loading && <Loader />}
        {error && <Message variant='danger'>{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='title'>
            <Form.Label className='text-black'>Tên chủ đề</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập tên chủ đề'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Container className='text-center'>
            <Button type='submit' className='button my-3'>
              Tạo chủ đề
            </Button>
          </Container>
        </Form>
      </FormContainer>
    </>
  );
};

export default BlogCategoryCreateScreen;
