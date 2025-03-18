import { Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Blog from '../components/Blog';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Product from '../components/Product';
import { useGetBlogsQuery } from '../slices/blogsApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
// import ProductCarousel from '../components/ProductCarousel';
import { useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import Container from '../components/Container';
import Meta from '../components/Meta';
import img1 from '../images/banner.png';
import img2 from '../images/banner2.png';
import BannerImage from '../images/banner3.png';
import BannerImage5 from '../images/banner4.png';
import SliderImage from '../images/Slider.png';
import { services } from '../utils/Data';
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
          <div className='col-12'>
            <div className='main-banner position-relative'>
              <img
                src={SliderImage}
                className='img-fluid rounded-3'
                alt='main banner'
              />

              {/* <div className='main-banner-content position-absolute'>
                <h4>ĐA DẠNG SẢN PHẨM</h4>
                <h5>Giá Thành Hợp Lý</h5>
                <p>Đừng bỏ lỡ các sản phẩm của chúng tôi</p>
                <Link to='/store'>
                  <button className='button'>XEM NGAY</button>
                </Link>
              </div> */}
            </div>
          </div>
          {/* <div className='col-6'>
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
          </div> */}
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
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/2-8a7a3474-ecb3-4b18-9e34-950adee48a16.jpg?v=1655462139530'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/17-0fb6e76f-77af-4900-a510-39726c0ae8d8.png?v=1728470711133'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/20-74ec2f75-5527-413d-a907-0543f591b695.jpg?v=1728642751660'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/13-6a7a5cd1-28a6-4052-a2e3-df1538cc62e4.png?v=1728534020283'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/img-2688.jpg?v=1690002944833'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/1-cd729131-3fd9-49a4-9847-3eb892917954.jpg?v=1655461519780'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/13-6a7a5cd1-28a6-4052-a2e3-df1538cc62e4.png?v=1728534020283'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/4-jpeg-d73c58f2-813b-4f36-b4e5-1a07d8afce9d.jpg?v=1700016936747'
                    alt='brand'
                  />
                </div>
                <div className='mx-4 w-25'>
                  <img
                    src='https://bizweb.dktcdn.net/thumb/compact/100/348/234/products/img-2688.jpg?v=1690002944833'
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
                src={img1}
                className='img-fluid'
                alt='famous'
              />

              {/* <div className='famous-content position-absolute'>
                <h5>ĐA DẠNG MẪU MÃ</h5>
                <h6>Son Tint Bóng</h6>
                <p>Giá chỉ từ 150.000</p>
              </div> */}
            </div>
          </div>
          <div className='col-3'>
            <div className='famous-card position-relative'>
              <img
                src={img2}
                className='img-fluid'
                alt='famous'
              />
              {/* <div className='famous-content position-absolute content'>
                <h5 className='text-black'>Màu Sắc Tươi Tắn</h5>
                <h6 className='text-black'>Cực Mướt Trên Môi</h6>
                <p className='text-black'>Bộ sưu tập mới nhất từ 3CE</p>
              </div> */}
            </div>
          </div>
          <div className='col-3'>
            <div className='famous-card position-relative'>
              <img
                src={BannerImage}  // Use the imported image
                className='img-fluid'
                alt='famous'
              />
              {/* <div className='famous-content position-absolute'>
                <h5 className='text-black'>Đa dạng màu sắc</h5>
                <h6 className='text-black'>Thể Hiện Chất Riêng</h6>
                <p className='text-black'>Cho bạn nhiều lựa chọn</p>
              </div> */}
            </div>
          </div>
          <div className='col-3'>
            <div className='famous-card position-relative'>
              <img
                src={BannerImage5}  // Use the imported image
                className='img-fluid'
                alt='famous'
              />
              {/* <div className='famous-content position-absolute'>
                <h5 className='text-black'>Mua ngay hôm nay</h5>
                <h6 className='text-black'>Chất Son Khác Nhau</h6>
                <p className='text-black'>Mang nhiều màu sắc</p>
              </div> */}
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
