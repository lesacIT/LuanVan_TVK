import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { IoArrowBack } from 'react-icons/io5';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';

const PlaceOrderScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [
    createOrder,
    { isLoading, isSuccess, data: order, error: orderError },
  ] = useCreateOrderMutation();

  const payMethod = {
    VNPay: 'order',
    COD: 'ordercod',
  };

  useEffect(() => {
    if (isSuccess && order) {
      // Chuyển hướng dựa trên phương thức thanh toán
      if (cart.paymentMethod === 'VNPay') {
        navigate(`/${payMethod[cart.paymentMethod]}/${order._id}`) // Đường dẫn cho VNPay
      } else if (cart.paymentMethod === 'COD') {
        navigate(`/ordercod/${order._id}`); // Đường dẫn cho COD
      }
    }
  }, [navigate, isSuccess, order, cart.paymentMethod, dispatch]);

  const placeOrderHandler = async () => {
    if (userInfo && userInfo.isAdmin) {
      // Ngăn admin đặt hàng và hiển thị thông báo
      toast.error('Admin không được phép mua hàng');
      return;
    }
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      // navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err || 'Lỗi đặt hàng');
    }
  };

  return (
    <>
      <Meta title={'Xác Nhận Đặt Hàng'} />
      <BreadCrumb title='Xác Nhận Đặt Hàng' />
      <Link to='/payment'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className='text-black'>
              <h5 className='text-black'>THÔNG TIN VẬN CHUYỂN</h5>
              <p>
                <strong>Tên: </strong>
                {cart.shippingAddress.name}
              </p>
              <p>
                <strong>Địa chỉ: </strong>
                {cart.shippingAddress.address}
              </p>
              <p>
                <strong>Số điện thoại: </strong>
                {cart.shippingAddress.mobile}
              </p>
              <p>
                <strong>Mã bưu điện: </strong>
                {cart.shippingAddress.postalCode}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className='text-black'>
              <h5 className='text-black'>PHƯƠNG THỨC THANH TOÁN</h5>
              <strong>Phương thức: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h5 className='text-black'>DANH SÁCH SẢN PHẨM</h5>
              {cart.cartItems.length === 0 ? (
                <Message>Giỏ hàng của bạn trống</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
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
                          {((item.qty * (item.price * 100)) / 100)
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
          <div className='placeorder'>
            <ListGroup variant='flush'>
              <ListGroup.Item style={{ backgroundColor: 'black' }}>
                <h5 className='text-center text-white my-1'>ĐƠN ĐẶT HÀNG</h5>
              </ListGroup.Item>
              <ListGroup.Item className='text-black'>
                <Row>
                  <Col>Tổng tiền</Col>
                  <Col>
                    {cart.itemsPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    VNĐ
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='text-black'>
                <Row>
                  <h6 style={{color: "var(--color-CE5A67)"}}><i>Đơn hàng trên 200 nghìn được miễn phí vận chuyển</i></h6>
                  <Col>Phí vận chuyển</Col>
                  <Col>
                    {cart.shippingPrice
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
                    {cart.taxPrice
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
                      {cart.totalPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                      VNĐ
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className='text-center'>
                  <Button
                    type='button'
                    className='btn-block button'
                    disabled={cart.cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Đặt hàng
                  </Button>
                </div>

                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
