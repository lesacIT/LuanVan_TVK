import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useCreateBlogMutation,
} from '../../slices/blogsApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const BlogListScreen = () => {
  const { pageNumber } = useParams();
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  const { data, isLoading, error, refetch } = useGetBlogsQuery({
    pageNumber,
  });

  const toggleExpand = (blogId) => {
    if (expandedBlogId === blogId) {
      setExpandedBlogId(null); // Đóng nội dung nếu đã mở
    } else {
      setExpandedBlogId(blogId); // Mở nội dung của bài viết khác
    }
  };

  const [deleteBlog, { isLoading: loadingDelete }] = useDeleteBlogMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc?')) {
      try {
        await deleteBlog(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [{ isLoading: loadingCreate }] = useCreateBlogMutation();

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h4 className='text-black'>DANH SÁCH BÀI VIẾT</h4>
        </Col>
        <Col className='text-end'>
          <Link to='/admin/blog/create' className='btn btn-primary my-3 button'>
            <FaPlus /> Thêm bài viết
          </Link>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>STT</th>
                <th>MÃ BÀI VIẾT</th>
                <th>TIÊU ĐỀ BÀI VIẾT</th>
                <th>HÌNH ẢNH</th>
                <th>CHỦ ĐỀ</th>
                <th>NỘI DUNG</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {data.blogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td>{index + 1}</td>
                  <td>{blog._id}</td>
                  <td>{blog.title}</td>
                  <td>
                    <img width={80} src={blog.image}></img>
                  </td>
                  <td>{blog.category}</td>
                  <td>
                    {/* Hiển thị nội dung rút gọn hoặc đầy đủ dựa trên trạng thái */}
                    {expandedBlogId === blog._id ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: blog.description.substring(0, 100) + '...',
                        }}
                      />
                    )}
                    {/* Nút mở/rút gọn nội dung */}
                    <Button
                      variant='light'
                      className='btn-sm btn details'
                      onClick={() => toggleExpand(blog._id)}
                    >
                      {expandedBlogId === blog._id ? 'Thu gọn' : 'Xem thêm'}
                    </Button>
                  </td>
                  <td>
                    <LinkContainer to={`/admin/blog/${blog._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2 edit'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(blog._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default BlogListScreen;
