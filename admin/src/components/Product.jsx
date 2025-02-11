import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}> 
      <Card
        className='mb-4 p-3 rounded card'
        style={{ width: '300px', height: '480px' }}
      >
        <Link to={`/product/${product._id}`}>
          <Card.Img src={product.image} variant='top' style={{ width: '250px', height: '250px' }}/>
        </Link>

        <Card.Body>
          <div className='brand'>{product.brand}</div>
          <Link to={`/product/${product._id}`}>
            <Card.Title as='div' className='product-title'>
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text>
            <Rating
              value={product.rating}
              text={`${product.numReviews} đánh giá`}
            />
          </Card.Text>

          <Card.Text className='pb-2'>
            {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default Product;
