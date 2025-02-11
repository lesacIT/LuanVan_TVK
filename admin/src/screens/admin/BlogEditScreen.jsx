import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetBlogDetailsQuery,
  useUpdateBlogMutation,
  useUploadBlogImageMutation,
} from '../../slices/blogsApiSlice';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useGetBlogCategoriesQuery } from '../../slices/bcategoryApiSlice';
import { IoArrowBack } from 'react-icons/io5';

const BlogEditScreen = () => {
  const { id: blogId } = useParams();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const {
    data: blog,
    isLoading,
    refetch,
    error,
  } = useGetBlogDetailsQuery(blogId);

  const { data: blogcategories, isLoading: blogcategoriesLoading } =
    useGetBlogCategoriesQuery();

  const [updateBlog, { isLoading: loadingUpdate }] = useUpdateBlogMutation();

  const [uploadBlogImage, { isLoading: loadingUpload }] =
    useUploadBlogImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setImage(blog.image);
      setCategory(blog.category);
      setDescription(blog.description);
      setPreviewImage(blog.image);
    }
  }, [blog]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu một trong các trường không được điền vào
    if (!title.trim() || !category || !description || !image) {
      toast.error('Vui lòng nhập đầy đủ thông tin bài viết');
      return;
    }
    try {
      await updateBlog({
        blogId,
        title,
        image,
        category,
        description,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Đã cập nhật bài viết');
      refetch();
      navigate('/admin/bloglist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadBlogImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setPreviewImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <Link to='/admin/bloglist'>
            <IoArrowBack className='icon-container' size={30} />
          </Link>
        </Col>
      </Row>
      <Container>
        <h3 className='text-black mt-4 text-center'>CHỈNH SỬA BÀI VIẾT</h3>
        {isLoading || (blogcategoriesLoading && <Loader />)}
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6} style={{ height: '100%' }}>
                <Form.Group controlId='title'>
                  <Form.Label className='text-black'>
                    Tiêu đề bài viết
                  </Form.Label>
                  <Form.Control
                    type='title'
                    placeholder='Nhập tiêu đề bài viết'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='category'>
                  <Form.Label className='my-2 text-black'>Chủ đề</Form.Label>
                  <Form.Control
                    as='select'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value=''>Chọn chủ đề</option>
                    {blogcategories &&
                      blogcategories.map((category) => (
                        <option key={category.id} value={category.title}>
                          {category.title}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId='image'>
                  <Form.Label column className='text-black'>
                    Hình ảnh
                  </Form.Label>
                  <Row>
                    <Col xs={8}>
                      <Form.Control
                        multiple
                        label='Chọn tệp'
                        onChange={uploadFileHandler}
                        type='file'
                      />
                      {loadingUpload && <Loader />}
                    </Col>
                    <Col xs={4}>
                      <div
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          height: '45px',
                        }}
                      >
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt='Preview'
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        ) : (
                          <div
                            style={{
                              textAlign: 'center',
                              fontStyle: 'italic',
                              color: '#888',
                              paddingTop: '10px',
                            }}
                          >
                            Ảnh bài viết
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col md={6} style={{ height: '100%' }}>
                <Form.Group controlId='description'>
                  <Form.Label className='text-black'>Nội dung</Form.Label>
                  <ReactQuill
                    theme='snow'
                    value={description}
                    onChange={setDescription}
                    required
                  />
                </Form.Group>
                <Container className='text-end'>
                  <Button type='submit' className='button my-3'>
                    Cập nhật
                  </Button>
                </Container>
              </Col>
            </Row>
          </Form>
        )}
      </Container>
    </>
  );
};

export default BlogEditScreen;
