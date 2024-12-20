import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';
import Container from '../components/Container';
import { MapInteractionCSS } from 'react-map-interaction';
import ReactStars from 'react-rating-stars-component';
import { IoArrowBack } from 'react-icons/io5';
import BreadCrumb from '../components/BreadCrumb';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ProductScreen = () => {
  const { id: productId } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setSelectedColor(null);
    return () => setSelectedColor(null);
  }, [productId]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showQuantityControl, setShowQuantityControl] = useState(true); // Tạo biến state để kiểm soát việc hiển thị phần điều chỉnh số lượng

  const copyToClipboard = (text) => {
    console.log('text', text);
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  // Hàm xử lý sự kiện chọn màu:
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Trong hàm addToCartHandler:
  const addToCartHandler = () => {
    // Kiểm tra xem người dùng đã chọn màu sắc chưa
    if (!selectedColor) {
      toast.error('Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng');
      return;
    }
    // Thêm vào giỏ hàng với thông tin màu sắc đã chọn
    dispatch(addToCart({ ...product, qty, color: selectedColor }));
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
    navigate('/cart');
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Đã đánh giá thành công');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingCartItem = cartItems.find(
      (item) => item._id === productId && item.color === selectedColor
    );
    setIsInCart(!!existingCartItem); // Cập nhật trạng thái sản phẩm trong giỏ hàng

    // Ẩn phần điều chỉnh số lượng nếu sản phẩm đã tồn tại trong giỏ hàng
    if (existingCartItem) {
      setShowQuantityControl(false);
    } else {
      setShowQuantityControl(true);
    }
  }, [cartItems, productId, selectedColor]);

  // Thay đổi nút thêm vào giỏ hàng thành nút đi đến giỏ hàng nếu sản phẩm đã tồn tại trong giỏ hàng
  const buttonContent = isInCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng';

  const buttonOnClick = isInCart ? () => navigate('/cart') : addToCartHandler;

  return (
    <>
      <Meta title={'Chi Tiết Sản Phẩm'} />
      <BreadCrumb title={product?.name} />
      <Link to='/store'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Container class1='main-product py-4'>
            <div className='row'>
              <div className='col-5'>
                <div className='main-product-image'>
                  <div>
                    <MapInteractionCSS
                      showControls
                      defaultValue={{
                        scale: 1,
                        translation: { x: 0, y: 20 },
                      }}
                      minScale={0.5}
                      maxScale={3}
                      translationBounds={{
                        xMax: 400,
                        yMax: 200,
                      }}
                    >
                      <img
                        src={product.image}
                        alt='product'
                        className='img-fluid d-flex mx-auto'
                      />
                    </MapInteractionCSS>
                  </div>
                </div>
              </div>
              <div className='col-7'>
                <div className='main-product-details'>
                  <div className='border-bottom'>
                    <h3 className='title'>{product.name}</h3>
                  </div>
                  <div className='border-bottom py-3'>
                    <p className='price text-black'>
                      {product.price
                        ?.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                      VNĐ
                    </p>
                    <div className='d-flex align-items-center gap-10'>
                      <ReactStars
                        count={5}
                        size={24}
                        value={product.rating?.toString()}
                        edit={false}
                        activeColor='#ffd700'
                      />
                      <p className='mb-0 t-review'>
                        ({product.numReviews?.toString()} đánh giá)
                      </p>
                    </div>
                    <a className='review-btn' href='#review'>
                      Viết một đánh giá
                    </a>
                  </div>
                  <div className='py-3'>
                    <div className='d-flex gap-10 align-items-center my-2'>
                      <h3 className='product-heading'>Thương hiệu:</h3>
                      <p className='product-data text-black'>{product.brand}</p>
                    </div>
                    <div className='d-flex gap-10 align-items-center my-2'>
                      <h3 className='product-heading'>Danh mục:</h3>
                      <p className='product-data text-black'>
                        {' '}
                        {product.category}
                      </p>
                    </div>
                    <div className='d-flex gap-10 align-items-center my-2'>
                      <h3 className='product-heading'>Trạng thái:</h3>
                      <p className='product-data text-black'>
                        {' '}
                        {product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </p>
                    </div>
                    <div className='d-flex gap-10 align-items-center my-2'>
                      <h3 className='product-heading'>Lượng hàng:</h3>
                      <p className='product-data text-black'>
                        {product.countInStock}
                      </p>
                    </div>
                    <div className='d-flex gap-10 align-items-center my-3'>
                      <h3 className='product-heading'>Chọn màu sắc:</h3>
                      {product.colors &&
                        product.colors.map((color, index) => (
                          <>
                            <div
                              key={index}
                              className={`color-option ${
                                selectedColor === color ? 'selected-color' : ''
                              }`} // Thêm class 'selected-color' nếu màu đã chọn
                              style={{
                                backgroundColor: color.colorCode,
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: '1px solid #ccc',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleColorSelect(color)}
                            ></div>{' '}
                            <Row
                              className='text-black mx-1'
                              style={{
                                fontSize: '13px',
                              }}
                            >
                              {color.title}
                            </Row>
                          </>
                        ))}
                    </div>
                    <div>
                      {selectedColor && (
                        <p className='product-data text-black'>
                          {selectedColor.quantity} sản phẩm có sẵn
                        </p>
                      )}
                    </div>

                    <div className='d-flex gap-10 align-items-center my-2'>
                      {showQuantityControl && (
                        <>
                          <h3 className='product-heading'>Chọn số lượng:</h3>
                          <div className='d-flex align-items-center'>
                            <Form.Control
                              className='form-control text-black mx-1 d-flex justify-content-center'
                              style={{ width: '70px', textAlign: 'center' }}
                              type='number'
                              min={1}
                              max={selectedColor ? selectedColor.quantity : 0}
                              value={qty}
                              onChange={(e) => {
                                const newValue = Number(e.target.value);
                                if (newValue === 0) {
                                  // Hiển thị cảnh báo nếu số lượng nhập vào là 0
                                  toast.error(
                                    'Số lượng không hợp lệ'
                                  );
                                } else if (
                                  newValue >
                                  (selectedColor ? selectedColor.quantity : 0)
                                ) {
                                  // Hiển thị cảnh báo nếu số lượng nhập vào lớn hơn số lượng sẵn có
                                  toast.error(
                                    'Số lượng nhập vào vượt quá số lượng sẵn có'
                                  );
                                } else {
                                  // Nếu số lượng hợp lệ, cập nhật giá trị qty
                                  setQty(newValue);
                                }
                              }}
                              disabled={!selectedColor}
                            />
                          </div>
                        </>
                      )}
                      <Button
                        className='btn-block button'
                        type='button'
                        disabled={
                          !selectedColor || selectedColor.quantity === 0
                        }
                        onClick={buttonOnClick} // Thay đổi hàm xử lý sự kiện khi click vào nút
                      >
                        {buttonContent} {/* Thay đổi nội dung của nút */}
                      </Button>
                    </div>
                  </div>

                  <div className='d-flex gap-10 flex-column my-3'>
                    <h3 className='product-heading'>Vận chuyển & hoàn trả:</h3>
                    <p className='product-data'>
                      Miễn phí vận chuyển và trả lại cho tất cả các đơn đặt hàng
                      có giá trị từ 300 ngàn! <br /> Chúng tôi vận chuyển tất cả
                      các đơn đặt hàng trong nước trong vòng <b>5-7 ngày!</b>
                    </p>
                  </div>
                  <div className='d-flex gap-10 align-items-center my-3'>
                    <h3 className='product-heading'>Liên kết sản phẩm:</h3>
                    <button
                      onClick={() => {
                        copyToClipboard(window.location.href);
                      }}
                      className='custom-link border-0 bg-white fw-'
                    >
                      <p className='mb-0'>
                        <small>Sao chép liên kết sản phẩm</small>
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
          <Container class1='description-wrapper py-5'>
            <div className='row'>
              <div className='col-12'>
                <h4>Mô tả</h4>
                <div className='description-inner-wrapper bg-white p-3'>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: product.description,
                    }}
                  ></p>
                </div>
              </div>
            </div>
          </Container>
          <Container class1='reviews-wrapper'>
            <div className='row'>
              <div className='col-12'>
                <h4 className='text-black'>Đánh giá</h4>
                {product.reviews.length === 0 && (
                  <Message>Không có đánh giá</Message>
                )}
                <ListGroup variant='flush'>
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <div className='my-2'>
                        <Rating value={review.rating} />
                      </div>
                      <p className='my-2'>
                        <span>
                          {format(
                            new Date(review.createdAt),
                            'HH:mm:ss, do MMMM yyyy',
                            { locale: vi }
                          )}
                        </span>
                      </p>

                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item id='review'>
                    <h5>Viết một đánh giá</h5>

                    {loadingProductReview && <Loader />}

                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group className='my-2' controlId='rating'>
                          <Form.Label>Chất lượng</Form.Label>
                          <Form.Control
                            as='select'
                            required
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value=''>Chọn...</option>
                            <option value='1'>1 - Rất tệ</option>
                            <option value='2'>2 - Tệ</option>
                            <option value='3'>3 - Tốt</option>
                            <option value='4'>4 - Rất tốt</option>
                            <option value='5'>5 - Tuyệt vời</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group className='my-2' controlId='comment'>
                          <Form.Label>Lời đánh giá sản phẩm</Form.Label>
                          <Form.Control
                            as='textarea'
                            row='3'
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <div className='text-end'>
                          <Button
                            disabled={loadingProductReview}
                            type='submit'
                            variant='primary'
                            className='button my-3'
                          >
                            Gửi đánh giá
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <Message>
                        Vui lòng{' '}
                        <strong>
                          <Link
                            to='/login'
                            style={{ color: 'rgb(113, 9, 52)' }}
                          >
                            đăng nhập
                          </Link>{' '}
                        </strong>
                        để viết đánh giá
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </div>
          </Container>
        </>
      )}
    </>
  );
};

export default ProductScreen;
