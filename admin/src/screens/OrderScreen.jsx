import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import { IoArrowBack } from 'react-icons/io5';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <Row className='align-items-center'>
        <Col>
          <Link to='/admin/orderlist'>
            <IoArrowBack className='icon-container' size={30} />
          </Link>
        </Col>
      </Row>
      <h4 className='pt-3 text-black text-center'>CHI TIẾT ĐƠN HÀNG</h4>
      <Row className='pb-5'>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className='text-black'>
              <h5 className='text-black'>VẬN CHUYỂN</h5>
              <p>
                <strong>Tên khách hàng: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Địa chỉ: </strong>
                {order.shippingAddress.address}
              </p>
              <p>
                <strong>Số điện thoại: </strong>
                {order.shippingAddress.mobile}
              </p>
              <p>
                <strong>Mã bưu điện: </strong>
                {order.shippingAddress.postalCode}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Đã xác nhận{' '}
                  {new Date(order.deliveredAt).toLocaleString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: false,
                  })}
                </Message>
              ) : (
                <Message variant='danger'>Chưa xác nhận</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className='text-black'>
              <h5 className='text-black'>PHƯƠNG THỨC THANH TOÁN</h5>
              <p>
                <strong>Phương thức: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  Đã thanh toán{' '}
                  {new Date(order.paidAt).toLocaleString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: false,
                  })}
                </Message>
              ) : (
                <Message variant='danger'>Chưa thanh toán</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h5 className='text-black'>SẢN PHẨM</h5>
              {order.orderItems.length === 0 ? (
                <Message>Không có đơn hàng</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index} className='text-black'>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col
                          md={2}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          {item.color && (
                            <div
                              style={{
                                backgroundColor: item.color.colorCode,
                                width: '25px',
                                height: '25px',
                                borderRadius: '50%',
                                border: '1px solid #ccc',
                              }}
                              title={item.color.title}
                            ></div>
                          )}
                        </Col>
                        <Col md={4}>
                          {item.qty} x{' '}
                          {item.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                          ={' '}
                          {(item.qty * item.price)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                          VNĐ
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <div className='mb-5 placeorder'>
            <ListGroup variant='flush'>
              <ListGroup.Item style={{ backgroundColor: 'black' }}>
                <h5 className='text-center text-white my-2'>ĐƠN ĐẶT HÀNG</h5>
              </ListGroup.Item>
              <ListGroup.Item className='text-black'>
                <Row>
                  <Col>Tổng tiền</Col>
                  <Col>
                    {order.itemsPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    VNĐ
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='text-black'>
                <Row>
                  <Col>Phí vận chuyển</Col>
                  <Col>
                    {order.shippingPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    VNĐ
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='text-black'>
                <Row>
                  <Col>Thuế</Col>
                  <Col>
                    {order.taxPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    VNĐ
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='text-black'>
                <Row>
                  <Col>
                    <strong>Tổng cộng</strong>
                  </Col>
                  <Col>
                    <strong>
                      {order.totalPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                      VNĐ
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                      <Button
                        type='button'
                        className='button'
                        onClick={deliverHandler}
                      >
                        Xác nhận đơn hàng
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
