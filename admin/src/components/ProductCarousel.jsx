import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-primary custom-carousel'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            {/* Đặt kích thước cố định cho hình ảnh */}
            <Image
              src={product.image}
              alt={product.name}
              fluid
              className='fixed-size-image' // Thêm lớp CSS cho hình ảnh
            />
            <Carousel.Caption className='carousel-caption'>
              <h5 className='text-white text-right'>
                {product.name} (
                {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ)
              </h5>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
