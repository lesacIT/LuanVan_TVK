import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetProductCategoriesQuery,
  useDeleteProductCategoryMutation,
  useCreateProductCategoryMutation,
} from '../../slices/pcategoryApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';

const ProductCategoryListScreen = () => {
  const { pageNumber } = useParams();

  const {
    data: productcategories,
    isLoading,
    error,
    refetch,
  } = useGetProductCategoriesQuery({
    pageNumber,
  });

  useEffect(() => {
    refetch(); // Gọi refetch khi tham số pageNumber thay đổi
  }, [pageNumber]);

  const [deleteProductCategory, { isLoading: loadingDelete }] =
    useDeleteProductCategoryMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc?')) {
      try {
        await deleteProductCategory(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [{ isLoading: loadingCreate }] = useCreateProductCategoryMutation();

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h4 className='text-black'>DANH SÁCH DANH MỤC SẢN PHẨM</h4>
        </Col>
        <Col className='text-end'>
          <Link
            to='/admin/productcategory/create'
            className='btn btn-primary my-3 button'
          >
            <FaPlus /> Thêm danh mục
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
                <th>MÃ DANH MỤC</th>
                <th>TÊN DANH MỤC SẢN PHẨM</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {productcategories.map((productcategory, index) => (
                <tr key={productcategory._id}>
                  <td>{index + 1}</td>
                  <td>{productcategory._id}</td>
                  <td>{productcategory.title}</td>
                  <td>
                    <LinkContainer
                      to={`/admin/productcategory/${productcategory._id}/edit`}
                    >
                      <Button variant='light' className='btn-sm mx-2 edit'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(productcategory._id)}
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

export default ProductCategoryListScreen;
