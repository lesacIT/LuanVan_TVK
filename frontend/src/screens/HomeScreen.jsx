import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetBlogsQuery } from '../slices/blogsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Blog from '../components/Blog';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
// import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import Container from '../components/Container';
import { services } from '../utils/Data';
import Marquee from 'react-fast-marquee';
import { useEffect } from 'react';

const HomeScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { pageNumber, keyword } = useParams();
  const isSearching =
    keyword !== undefined && keyword !== null && keyword !== '';

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const {
    data: blogData,
    isLoading: blogLoading,
    error: blogError,
  } = useGetBlogsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Meta title={'Trang Chủ'} />
      <Container class1='home-wrapper-1 pb-4 pt-3'>
        <div className='row'>
          <div className='col-6'>
            <div className='main-banner position-relative'>
              <img
                src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104746/main-banner-1_twci07.jpg'
                className='img-fluid rounded-3'
                alt='main banner'
              />
              <div className='main-banner-content position-absolute'>
                <h4>ĐA DẠNG SẢN PHẨM</h4>
                <h5>Giá Thành Hợp Lý</h5>
                <p>Đừng bỏ lỡ các sản phẩm của chúng tôi</p>
                <Link to='/store'>
                  <button className='button'>XEM NGAY</button>
                </Link>
              </div>
            </div>
          </div>
          <div className='col-6'>
            <div className='d-flex flex-wrap gap-10 justify-content-between align items-center'>
              <div className='small-banner position-relative'>
                <img
                  src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104711/catbanner-01_zm3igl.jpg'
                  className='img-fluid rounded-3'
                  alt='main banner'
                />
                <div className='small-banner-content position-absolute'>
                  <h4>ƯU ĐÃI TỐT NHẤT</h4>
                  <h5>
                    <em>innisfree</em>
                  </h5>
                  <p>Đa dạng màu sắc</p>
                </div>
              </div>
              <div className='small-banner position-relative'>
                <img
                  src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104712/catbanner-02_bl2hzx.jpg'
                  className='img-fluid rounded-3'
                  alt='main banner'
                />
                <div className='small-banner-content position-absolute'>
                  <h4>SẢN PHẨM MỚI</h4>
                  <h5>M.A.C</h5>
                  <p>Thương hiệu hàng đầu</p>
                </div>
              </div>
              <div className='small-banner position-relative'>
                <img
                  src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104714/catbanner-03_jadrev.jpg'
                  className='img-fluid rounded-3'
                  alt='main banner'
                />
                <div className='small-banner-content position-absolute'>
                  <h4>MUA LIỀN TAY</h4>
                  <h5>3CE</h5>
                  <p>
                    Mua ngay các <br /> màu sắc mới nhất
                  </p>
                </div>
              </div>
              <div className='small-banner position-relative'>
                <img
                  src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104716/catbanner-04_m1lc6o.jpg'
                  className='img-fluid rounded-3'
                  alt='main banner'
                />
                <div className='small-banner-content position-absolute'>
                  <h4>VẬN CHUYỂN NHANH</h4>
                  <h5>Bbia</h5>
                  <p>
                    Chất son cực mịn <br /> mượt mà trên môi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container class1='home-wrapper-2 py-5'>
        <div className='row'>
          <div className='col-12'>
            <div className='services d-flex align-items-center justify-content-between'>
              {services &&
                services?.map((i, j) => {
                  return (
                    <div className='d-flex align-items-center gap-15' key={j}>
                      <img src={i?.image} alt='services' />
                      <div>
                        <h6 className='fw-bold'>{i?.title}</h6>
                        <p className='mb-0'>{i?.tagline}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Container>

      {productLoading ? (
        <Loader />
      ) : productError ? (
        <Message variant='danger'>
          {productError?.data?.message || productError.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h4 className='text-black my-4'>SẢN PHẨM MỚI</h4>
          <Row>
            {productData.products.slice(0, 8).map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <div className='text-center mt-3 pb-3'>
            <Link to='/store' >
              <button className='button'>Xem tất cả</button>
            </Link>
          </div>
        </>
      )}

      <Container class1='marquee-wrapper my-4'>
        <div className='row'>
          <div className='col-12'>
            <div className='marquee-inner-wrapper bg-white p-3 card-wrapper'>
              <Marquee className='d-flex'>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104581/brand-01_x8rua9.jpg'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104582/brand-02_x0ah0g.jpg'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104584/brand-03_ldtttt.jpg'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104662/brand-04_oprgab.jpg'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104700/brand-05_s5i5r7.jpg'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104701/brand-06_ocevx3.jpg'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104703/brand-07_ucayta.jpg'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104705/brand-08_cnakv9.jpg'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104707/brand-09_zne1sq.jpg'
                    alt='brand'
                  />
                </div>
              </Marquee>
            </div>
          </div>
        </div>
      </Container>

      <Container class1='famous-wrapper py-4'>
        <div className='row'>
          <div className='col-3'>
            <div className='famous-card position-relative'>
              <img
                src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104724/famous-01_vn6v9s.jpg'
                className='img-fluid'
                alt='famous'
              />
              <div className='famous-content position-absolute'>
                <h5>ĐA DẠNG MẪU MÃ</h5>
                <h6>Son Tint Bóng</h6>
                <p>Giá chỉ từ 150.000</p>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='famous-card position-relative'>
              <img
                src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104725/famous-02_afoe9z.jpg'
                className='img-fluid'
                alt='famous'
              />
              <div className='famous-content position-absolute content'>
                <h5 className='text-black'>Màu Sắc Tươi Tắn</h5>
                <h6 className='text-black'>Cực Mướt Trên Môi</h6>
                <p className='text-black'>Bộ sưu tập mới nhất từ 3CE</p>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='famous-card position-relative'>
              <img
                src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104727/famous-03_cpd3tr.jpg'
                className='img-fluid'
                alt='famous'
              />
              <div className='famous-content position-absolute'>
                <h5 className='text-black'>Đa dạng màu sắc</h5>
                <h6 className='text-black'>Thể Hiện Chất Riêng</h6>
                <p className='text-black'>Cho bạn nhiều lựa chọn</p>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='famous-card position-relative'>
              <img
                src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713104729/famous-04_lazymg.jpg'
                className='img-fluid'
                alt='famous'
              />
              <div className='famous-content position-absolute'>
                <h5 className='text-black'>Mua ngay hôm nay</h5>
                <h6 className='text-black'>Chất Son Khác Nhau</h6>
                <p className='text-black'>Mang nhiều màu sắc</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {blogLoading ? (
        <Loader />
      ) : blogError ? (
        <Message variant='danger'>
          {blogError?.data?.message || blogError.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h4 className='text-black my-4'>BÀI VIẾT MỚI</h4>
          <Row className='mt-3 mb-4'>
            {blogData.blogs?.slice(0, 8).map((blog) => (
              <Col key={blog._id} sm={12} md={6} lg={4} xl={3}>
                <Blog blog={blog} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={blogData?.pages}
            page={blogData?.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}

      {/* {!isSearching && <ProductCarousel />} */}
    </>
  );
};

export default HomeScreen;
