import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetBlogCategoriesQuery,
  useDeleteBlogCategoryMutation,
  useCreateBlogCategoryMutation,
} from '../../slices/bcategoryApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';

const BlogCategoryListScreen = () => {
  const { pageNumber } = useParams();

  const {
    data: blogcategories,
    isLoading,
    error,
    refetch,
  } = useGetBlogCategoriesQuery({
    pageNumber,
  });

  useEffect(() => {
    refetch(); // Gọi refetch khi tham số pageNumber thay đổi
  }, [pageNumber]);

  const [deleteBlogCategory, { isLoading: loadingDelete }] = useDeleteBlogCategoryMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc?')) {
      try {
        await deleteBlogCategory(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [{ isLoading: loadingCreate }] = useCreateBlogCategoryMutation();

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h4 className='text-black'>DANH SÁCH CHỦ ĐỀ BÀI VIẾT</h4>
        </Col>
        <Col className='text-end'>
          <Link
            to='/admin/blogcategory/create'
            className='btn btn-primary my-3 button'
          >
            <FaPlus /> Thêm chủ đề
          </Link>
        </Col>
      </Row>
      
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
              <th>STT</th>
                <th>MÃ CHỦ ĐỀ</th>
                <th>TÊN CHỦ ĐỀ</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {blogcategories.map((blogcategory, index) => (
                <tr key={blogcategory._id}>
                   <td>{index + 1}</td>
                  <td>{blogcategory._id}</td>
                  <td>{blogcategory.title}</td>
                  <td>
                    <LinkContainer to={`/admin/blogcategory/${blogcategory._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2 edit'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(blogcategory._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default BlogCategoryListScreen;
