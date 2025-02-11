import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetEnquiriesQuery,
  useDeleteEnquiryMutation,
} from '../../slices/enquiriesSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const EnquiryListScreen = () => {
  const { pageNumber } = useParams();

  const {
    data: enquiries,
    isLoading,
    error,
    refetch,
  } = useGetEnquiriesQuery({
    pageNumber,
  });

  const [deleteEnquiry, { isLoading: loadingDelete }] =
    useDeleteEnquiryMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc?')) {
      try {
        await deleteEnquiry(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h4 className='text-black'>DANH SÁCH YÊU CẦU</h4>
        </Col>
      </Row>

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
                <th>NGÀY GỬI</th>
                <th>NGƯỜI DÙNG</th>
                <th>EMAIL</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>NỘI DUNG</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {enquiries &&
                enquiries.map((enquiry, index) => (
                  <tr key={enquiry._id}>
                    <td>{index + 1}</td>
                    <td>{enquiry.createdAt.substring(0, 10)}</td>
                    <td>{enquiry.name}</td>
                    <td>{enquiry.email}</td>
                    <td>{enquiry.mobile}</td>
                    <td>{enquiry.comment}</td>
                    <td>{enquiry.status}</td>
                    <td>
                      <LinkContainer to={`/admin/enquiry/${enquiry._id}/edit`}>
                        <Button variant='light' className='btn-sm mx-2 edit'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(enquiry._id)}
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

export default EnquiryListScreen;
