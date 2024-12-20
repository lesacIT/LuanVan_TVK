import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { IoArrowBack } from 'react-icons/io5';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  // useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import axios from 'axios';

const OrderScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    if (!order || order.successPay || order.successDeliver) {
      if (order && order.isPaid) {
        // Định nghĩa một hàm để xử lý việc giao hàng nếu cần
        deliverOrder(orderId).then(() => console.log('Order delivered'));
      } else {
        payOrder({ orderId, details: { paymentMethod: 'VNPay' } })
          .then((response) => console.log('Payment processed', response))
          .catch((error) => console.error('Payment failed', error));
      }
    }
  }, [dispatch, orderId, order, navigate, userInfo, payOrder, deliverOrder]);

  const Handler = () => {
    axios
      .get(
        `http://localhost:5000/api/payment/vnpay?amount=${parseInt(
          order.totalPrice
        )}&orderType=1&orderDescription=${order._id}`
      )
      .then((response) => {
        const newWindow = window.open(response.data, '_blank', 'noreferer');
        const interval = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(interval);
            window.location.reload();
          }
        }, 1000);
      })
      .catch((error) => {
        console.error('VNPay Payment Error:', error);
        toast.error('VNPay payment failed');
      });
  };

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
      <Meta title={'Chi Tiết Đơn Hàng'} />
      <BreadCrumb title={order?._id} />
      <Link to='/profile'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <h4 className='my-4 text-black text-center'>CHI TIẾT ĐƠN HÀNG</h4>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className='text-black'>
              <h5>THÔNG TIN VẬN CHUYỂN</h5>
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
              <h5>PHƯƠNG THỨC THANH TOÁN</h5>
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
              <h5 className='text-black'>DANH SÁCH SẢN PHẨM</h5>
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
                <h5 className='text-center text-white my-1'>ĐƠN ĐẶT HÀNG</h5>
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
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  <div onClick={Handler} className='text-center'>
                    <Button className='button'>
                      Cổng thanh toán VNPay
                      <img
                        onClick={Handler}
                        width={30}
                        src='https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png'
                        alt='sZSTOb.png'
                        border='0'
                        className='mx-2'
                      />
                    </Button>
                  </div>
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block button'
                      onClick={deliverHandler}
                    >
                      Xác nhận giao hàng
                    </Button>
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
