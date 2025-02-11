import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetColorsQuery,
  useDeleteColorMutation,
  useCreateColorMutation,
} from '../../slices/colorApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';

const ColorListScreen = () => {
  const { pageNumber } = useParams();

  const {
    data: colors,
    isLoading,
    error,
    refetch,
  } = useGetColorsQuery({
    pageNumber,
  });

  useEffect(() => {
    refetch(); // Gọi refetch khi tham số pageNumber thay đổi
  }, [pageNumber]);

  const [deleteColor, { isLoading: loadingDelete }] = useDeleteColorMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc?')) {
      try {
        await deleteColor(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [{ isLoading: loadingCreate }] = useCreateColorMutation();

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h4 className='text-black'>DANH SÁCH MÀU SẮC</h4>
        </Col>
        <Col className='text-end'>
          <Link
            to='/admin/color/create'
            className='btn btn-primary my-3 button'
          >
            <FaPlus /> Thêm màu sắc
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
                <th>MÃ MÀU</th>
                <th>TÊN MÀU</th>
                <th>MÀU HIỂN THỊ</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {colors.map((color, index) => (
                <tr key={color._id}>
                  <td>{index + 1}</td>
                  <td>{color.colorCode}</td>
                  <td>{color.title}</td>
                  <td
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: color.colorCode,
                      }}
                    ></div>
                  </td>
                  <td>
                    <LinkContainer to={`/admin/color/${color._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2 edit'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(color._id)}
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

export default ColorListScreen;
