import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Container,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { IoArrowBack } from 'react-icons/io5';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const CartScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty, color) => {
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingCartItem = cartItems.find(
      (item) => item._id === product._id && item.color === color
    );

    // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng của nó
    if (existingCartItem) {
      dispatch(
        addToCart({
          ...existingCartItem,
          qty: qty, // Số lượng mới được truyền vào
        })
      );
    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới
      dispatch(addToCart({ ...product, qty, color }));
    }
  };

  const removeFromCartHandler = (id, color) => {
    dispatch(removeFromCart({ id, color }));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <>
      <Meta title={'Giỏ Hàng'} />
      <BreadCrumb title='Giỏ Hàng' />
      <Link to='/store'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container className='py-3'>
        <div className='row'>
          <div className='col-12'>
            <h3
              style={{ marginBottom: '20px', color: 'black' }}
              className='mt-2 text-center'
            >
              Giỏ Hàng
            </h3>
            {cartItems.length === 0 ? (
              <>
                <Message style={{ backgroundColor: 'black' }}>
                  <div className='text-center'>
                    <img
                      width={300}
                      src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713703102/11329060_eplvbe.png'
                    ></img>
                  </div>
                  <div className='text-center'> Giỏ hàng của bạn trống</div>
                </Message>
              </>
            ) : (
              <>
                <ListGroup variant='flush'>
                  <div className='cart-header d-flex text-center text-black'>
                    <h4 className='col-md-1'>STT</h4>
                    <h4 className='col-md-2'>Hình ảnh</h4>
                    <h4 className='col-md-3'>Tên</h4>
                    <h4 className='col-md-1'>Số lượng</h4>
                    <h4 className='col-md-1'>Xóa</h4>
                    <h4 className='col-md-2'>Màu sắc</h4>
                    <h4 className='col-md-2'>Giá</h4>
                  </div>
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={1} className='text-center'>
                          {index + 1}
                        </Col>
                        <Col md={2} className='text-center'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                            style={{ width: '100px' }}
                          />
                        </Col>
                        <Col md={3} className='text-center'>
                          <Link
                            className='my-2 custom-link'
                            to={`/product/${item._id}`}
                          >
                            {item.name}
                          </Link>
                        </Col>

                        <Col className='my-2 text-center' md={1}>
                          <div className='d-flex align-items-center justify-content-center'>
                            <Form.Control
                              className='text-center'
                              style={{ width: '70px', textAlign: 'center' }}
                              type='number'
                              min={1}
                              max={item.color.quantity}
                              value={item.qty}
                              onChange={(e) => {
                                const newQty = Number(e.target.value);
                                if (newQty === 0) {
                                  // Hiển thị cảnh báo nếu số lượng nhập vào là 0
                                  toast.error(
                                    'Số lượng không hợp lệ'
                                  );
                                  return; // Dừng xử lý tiếp theo
                                } else if (newQty > item.color.quantity) {
                                  // Hiển thị cảnh báo nếu số lượng vượt quá số lượng có sẵn
                                  toast.error(
                                    'Số lượng vượt quá số lượng có sẵn'
                                  );
                                  return; // Dừng xử lý tiếp theo
                                }
                                // Tiếp tục cập nhật số lượng nếu không có vấn đề
                                addToCartHandler(
                                  item,
                                  newQty,
                                  item.color ? item.color : null
                                );
                              }}
                            />
                            {item.color.quantity === 0 && (
                              <p
                                style={{
                                  color: 'red',
                                  fontSize: '12px',
                                  marginTop: '5px',
                                }}
                              >
                                Không còn hàng
                              </p>
                            )}
                          </div>
                        </Col>

                        <Col className='my-2 py-1 text-center' md={1}>
                          <Button
                            type='button'
                            variant='light'
                            onClick={() =>
                              removeFromCartHandler(item._id, item.color)
                            }
                          >
                            <FaTrash />
                          </Button>
                        </Col>

                        <Col
                          className='my-2 text-center'
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
                        <Col className='my-2 text-center' md={2}>
                          {item.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                          VNĐ
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className='col-12 align-self-end text-black'>
                  <div className='d-flex justify-content-end'>
                    <div className='d-flex flex-column align-items-end'>
                      <h4>
                        Tổng sản phẩm (
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                      </h4>
                      <h5>
                        Tổng tiền sản phẩm:{' '}
                        {cartItems
                          .reduce((acc, item) => acc + item.qty * item.price, 0)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                        VNĐ
                      </h5>
                      <p>Thuế và phí vận chuyển được tính khi thanh toán</p>
                      <Button
                        className='button btn-block'
                        type='button'
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                      >
                        Đi đến thanh toán
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default CartScreen;
