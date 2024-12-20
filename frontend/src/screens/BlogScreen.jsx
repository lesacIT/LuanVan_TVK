import React, { useEffect } from 'react';
import Meta from '../components/Meta';
import Blog from './../components/Blog';
import Container from '../components/Container';
import { useGetBlogsQuery } from '../slices/blogsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { useParams, Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import BreadCrumb from "../components/BreadCrumb";

const BlogScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { pageNumber, keyword } = useParams();

  const {
    data: blogData,
    isLoading: blogLoading,
    error: blogError,
  } = useGetBlogsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Meta title={'Bài Viết'} />
      <BreadCrumb title="Bài Viết" />
      <Link to='/'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container class1='blog-wrapper p-2'>
        <div className='row'>
          <div className=''>
            <div className='row'>
              {blogLoading ? (
                <Loader />
              ) : blogError ? (
                <Message variant='danger'>
                  {blogError?.data?.message || blogError.error}
                </Message>
              ) : (
                <>
                  <Meta />
                  <Row className='mt-3 mb-4'>
                    {blogData.blogs?.map((blog) => (
                      <Col key={blog._id} sm={12} md={6} lg={4} xl={3}>
                        <Blog blog={blog} />
                      </Col>
                    ))}
                  </Row>
                  <Paginate
                    pages={blogData?.pages}
                    page={blogData?.page}
                    keyword={keyword ? keyword : ''}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default BlogScreen;
