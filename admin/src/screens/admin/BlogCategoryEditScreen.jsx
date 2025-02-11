import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetBlogCategoryDetailsQuery,
  useUpdateBlogCategoryMutation,
} from '../../slices/bcategoryApiSlice';
import { IoArrowBack } from 'react-icons/io5';

const BlogCategoryEditScreen = () => {
  const { id: blogcategoryId } = useParams();
  const [title, setTitle] = useState('');

  const {
    data: blogcategory,
    isLoading,
    refetch,
    error,
  } = useGetBlogCategoryDetailsQuery(blogcategoryId);

  const [updateBlogCategory, { isLoading: loadingUpdate }] =
    useUpdateBlogCategoryMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); // Kiểm tra nếu trường 'title' hoặc 'colorCode' không được điền vào
    // Kiểm tra nếu trường 'title' không được điền vào
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên chủ đề');
      return;
    }
    try {
      await updateBlogCategory({
        blogcategoryId,
        title,
      }).unwrap(); // Unwrap the Promise to catch any rejection in the catch block
      toast.success('Đã cập nhật chủ đề');
      refetch();
      navigate('/admin/blogcategorylist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (blogcategory) {
      setTitle(blogcategory.title);
    }
  }, [blogcategory]);

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
        <h3 className='text-black text-center'>CHỈNH SỬA CHỦ ĐỀ</h3>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='title'>
              <Form.Label className='text-black'>Tên chủ đề</Form.Label>
              <Form.Control
                type='text'
                placeholder='Nhập tên chủ đề'
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

export default BlogCategoryEditScreen;
