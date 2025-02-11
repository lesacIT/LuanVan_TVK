import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetBrandsQuery,
  useDeleteBrandMutation,
  useCreateBrandMutation,
} from '../../slices/brandsApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';

const BrandListScreen = () => {
  const { pageNumber } = useParams();

  const {
    data: brands,
    isLoading,
    error,
    refetch,
  } = useGetBrandsQuery({
    pageNumber,
  });

  useEffect(() => {
    refetch(); // Gọi refetch khi tham số pageNumber thay đổi
  }, [pageNumber]);

  const [deleteBrand, { isLoading: loadingDelete }] = useDeleteBrandMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc?')) {
      try {
        await deleteBrand(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [{ isLoading: loadingCreate }] = useCreateBrandMutation();

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h4 className='text-black'>DANH SÁCH THƯƠNG HIỆU</h4>
        </Col>
        <Col className='text-end'>
          <Link
            to='/admin/brand/create'
            className='btn btn-primary my-3 button'
          >
            <FaPlus /> Thêm thương hiệu
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
                <th>MÃ THƯƠNG HIỆU</th>
                <th>TÊN THƯƠNG HIỆU</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, index) => (
                <tr key={brand._id}>
                  <td>{index + 1}</td>
                  <td>{brand._id}</td>
                  <td>{brand.title}</td>
                  <td>
                    <LinkContainer to={`/admin/brand/${brand._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2 edit'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(brand._id)}
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

export default BrandListScreen;
