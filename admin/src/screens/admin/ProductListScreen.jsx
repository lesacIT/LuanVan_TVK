import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc?')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [{ isLoading: loadingCreate }] = useCreateProductMutation();

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h4 className='text-black'>DANH SÁCH SẢN PHẨM</h4>
        </Col>
        <Col className='text-end'>
          <Link
            to='/admin/product/create'
            className='btn btn-primary my-3 button'
          >
            <FaPlus /> Thêm sản phẩm
          </Link>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>STT</th>
                <th>MÃ SẢN PHẨM</th>
                <th>TÊN SẢN PHẨM</th>
                <th>HÌNH ẢNH</th>
                <th>MÀU SẮC & SỐ LƯỢNG</th>
                <th>GIÁ</th>
                <th>PHÂN LOẠI</th>
                <th>THƯƠNG HIỆU</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>
                    <img width={80} src={product.image}></img>
                  </td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        margin: '10px',
                      }}
                    >
                      <Row
                        style={{ display: 'flex', justifyContent: 'center' }}
                        className='mb-5'
                      >
                        {product.colors.map((color, colorIndex) => (
                          <>
                            <Row>
                              <Col>
                                <div
                                  key={colorIndex}
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: color.colorCode,
                                    margin: '2px', // Thêm khoảng cách giữa các màu
                                  }}
                                  title={color.title} // Hiển thị tiêu đề khi rê chuột vào
                                />
                              </Col>

                              <Col className='my-2'>{color.quantity}</Col>
                            </Row>
                          </>
                        ))}
                      </Row>
                    </div>
                  </td>
                  <td>
                    {product.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2 edit'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
