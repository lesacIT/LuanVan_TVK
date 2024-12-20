import React, { useEffect, useState } from 'react';
import Meta from '../components/Meta';
import Container from '../components/Container';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { useParams, Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import BreadCrumb from '../components/BreadCrumb';
import Product from './../components/Product';
import FilterComponent from '../components/FilterComponent';

const StoreScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { pageNumber, keyword } = useParams();
  const [filters, setFilters] = useState({ category: '', brand: '' });

  const isSearching =
    keyword !== undefined && keyword !== null && keyword !== '';

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
    ...filters,
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Meta title={'Cửa Hàng'} />
      <BreadCrumb title='Cửa Hàng' />
      <Link to='/'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container class1='blog-wrapper p-2'>
        <div className='row'>
          <div className=''>
            <div className='row'>
              {productLoading ? (
                <Loader />
              ) : productError ? (
                <Message variant='danger'>
                  {productError?.data?.message || productError.error}
                </Message>
              ) : (
                <>
                  <Meta />
                  <div className='text-center'>
                    <Container>
                      <h5 className='section-heading text-uppercase mt-4 '>
                        {isSearching
                          ? 'Kết quả tìm kiếm'
                          : 'SẢN PHẨM CỦA CHÚNG TÔI'}
                      </h5>
                    </Container>
                  </div>
                  <Row>
                    <Col md={3}>
                      <FilterComponent onFilterChange={handleFilterChange} />
                    </Col>
                    <Col md={9}>
                      {productData?.products.length > 0 ? (
                        <Row>
                          {productData.products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={4}>
                              <Product product={product} />
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <Message>Không có kết quả</Message> // Thông báo khi không có sản phẩm
                      )}
                    </Col>
                  </Row>

                  <Paginate
                    pages={productData?.pages}
                    page={productData?.page}
                    keyword={keyword ? keyword : ''}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default StoreScreen;
