import { FaTimes, FaCheck } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';
import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import {
  BestSellingProduct,
  useGrowthData,
  TotalOrders,
  useTotalOrdersCumulative,
  useCalculateTotalRevenue,
  RevenueByTimeRange,
  CalculateTotalRevenuePaid,
  TotalOrdersCumulativePaid,
} from '../slices/useStats';
import MyChartComponent from '../components/MyChartComponent';
import { BsFileText } from 'react-icons/bs';
import { GrMoney } from 'react-icons/gr';
import { FaRegUserCircle } from 'react-icons/fa';
import { RiProductHuntLine } from 'react-icons/ri';
import { LinkContainer } from 'react-router-bootstrap';

const HomeScreen = () => {
  const {
    data: orders,
    isLoading: orderLoading,
    error: orderError,
  } = useGetOrdersQuery();

  const { totalOrdersAll } = useTotalOrdersCumulative();

  const { totalOrdersPaid } = TotalOrdersCumulativePaid();

  const { totalRevenueAll } = useCalculateTotalRevenue();

  const { totalRevenuePaid } = CalculateTotalRevenuePaid();

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (!orderLoading && orders) {
      const updatedOrders = orders.map((order) => ({
        ...order,
        totalQty: order.orderItems.reduce((total, item) => total + item.qty, 0),
      }));
      setOrderData(updatedOrders);
    }
  }, [orderLoading, orders]);

  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const [type, setType] = useState('daily');

  const [data, setData] = useState({
    totalProducts: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setData({}); // Reset data before fetching new data
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/stats?startDate=${startDate}&endDate=${endDate}`
      );
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, fetchData]); // Thêm fetchData vào mảng phụ thuộc

  const handleChangeStart = (event) => {
    setStartDate(event.target.value);
  };

  const handleChangeEnd = (event) => {
    setEndDate(event.target.value);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const {
    data: growthData,
    loading: growthLoading,
    error: growthError,
  } = useGrowthData({ startDate, endDate, type });

  return (
    <div>
      <h4 className='mb-4 title text-black' style={{ marginTop: '100px' }}>
        TỔNG QUAN
      </h4>
      <Row className='d-flex justify-content-between align-items-center gap-3'>
        <Col className='d-flex p-3 justify-content-between align-items-end flex-grow-1 p-3 roudned-3 totalOrderP'>
          <div>
            <p className=''>ĐƠN ĐẶT HÀNG ĐÃ THANH TOÁN</p>
            <h5 className='mb-0'>{totalOrdersPaid}</h5>
            <p className='mb-0'>Số lượng đơn đã thanh toán từ trước đến nay</p>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <BsFileText style={{ fontSize: '2.5rem' }} />
          </div>
        </Col>

        <Col className='d-flex p-3 justify-content-between align-items-end flex-grow-1 p-3 roudned-3 totalRevenueP'>
          <div>
            <p className=''>TỔNG DOANH THU</p>
            <h5 className='mb-0'>
              {totalRevenuePaid
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </h5>
            <p className='mb-0'>
              Tổng tiền thu được từ các đơn từ trước đến nay
            </p>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <GrMoney style={{ fontSize: '2.5rem' }} />
          </div>
        </Col>
      </Row>

      <Row className='d-flex justify-content-between align-items-center gap-3 mt-3'>
        <Col className='d-flex p-3 justify-content-between align-items-end flex-grow-1 p-3 roudned-3 totalUser'>
          <div>
            <p className=''>NGƯỜI DÙNG</p>
            <h5 className='mb-0'>{data?.totalUsers}</h5>
            <p className='mb-0'>Tài khoản người dùng</p>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <FaRegUserCircle style={{ fontSize: '2.5rem' }} />
          </div>
        </Col>
        <Col className='d-flex p-3 justify-content-between align-items-end flex-grow-1 p-3 roudned-3 totalProduct'>
          <div>
            <p className=''>SẢN PHẨM</p>
            <h5 className='mb-0'>{data?.totalProducts}</h5>
            <p className='mb-0'>Tổng sản phẩm trong cửa hàng</p>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <RiProductHuntLine style={{ fontSize: '2.5rem' }} />
          </div>
        </Col>
      </Row>

      <Row className='my-4'>
        <BestSellingProduct />
      </Row>

      <div>
        <h4 className='mt-5 text-black'>THỐNG KÊ ĐƠN HÀNG VÀ DOANH THU</h4>
        <Form>
          <Row className='mb-3'>
            <Col>
              <Form.Group controlId='startDate'>
                <Form.Label className='text-black'>Từ ngày</Form.Label>
                <Form.Control
                  type='date'
                  value={startDate}
                  onChange={handleChangeStart}
                  style={{ borderColor: 'rgb(95, 29, 40)' }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='endDate'>
                <Form.Label className='text-black'>Đến ngày</Form.Label>
                <Form.Control
                  type='date'
                  value={endDate}
                  onChange={handleChangeEnd}
                  style={{ borderColor: 'rgb(95, 29, 40)' }}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* <div className='text-end my-3'>
            <Button className='button' variant='primary' type='button' onClick={fetchData}>
              Thống kê
            </Button>
          </div> */}
        </Form>
        <Row>
          <Col>
            <TotalOrders startDate={startDate} endDate={endDate} />
          </Col>
          <Col>
            <RevenueByTimeRange startDate={startDate} endDate={endDate} />
          </Col>
        </Row>
      </div>

      <div className='my-5'>
        <h4 className='mt-5 text-black'>
          BIỂU ĐỒ THỐNG KÊ ĐƠN HÀNG VÀ DOANH THU
        </h4>
        <div>
          <MyChartComponent data={growthData} />
        </div>
      </div>
      <div className='my-5'>
        <h4 className=' text-black title'>ĐƠN ĐẶT HÀNG GẦN ĐÂY</h4>
        <div>
          {orderLoading ? (
            <Loader />
          ) : orderError ? (
            <Message variant='danger'>
              {orderError?.data?.message || orderError.error}
            </Message>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>KHÁCH HÀNG</th>
                  <th>NGÀY ĐẶT</th>
                  <th>SỐ LƯỢNG SẢN PHẨM</th>
                  <th>TỔNG TIỀN</th>
                  <th>ĐÃ THANH TOÁN</th>
                  <th>ĐÃ XÁC NHẬN</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {orderData.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>
                      {order.createdAt ? (
                        new Date(order.createdAt).toLocaleDateString('vi-VN')
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>{order.totalQty}</td>
                    <td>
                      {order.totalPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </td>
                    <td>
                      {order.isPaid ? (
                        new Date(order.paidAt).toLocaleDateString('vi-VN')
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        new Date(order.deliveredAt).toLocaleDateString('vi-VN')
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer
                        to={`/${
                          order.paymentMethod === 'VNPay' ? 'order' : 'ordercod'
                        }/${order._id}`}
                      >
                        <Button variant='light' className='btn-sm btn details'>
                          Xem chi tiết
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
