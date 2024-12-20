import React, { useState } from 'react';
import { useGetCategoriesAndBrandsQuery } from '../slices/productsApiSlice';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { SiBrandfolder } from 'react-icons/si';
import { BiGridAlt } from 'react-icons/bi';

const FilterComponent = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const { data, error, isLoading } = useGetCategoriesAndBrandsQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ category: selectedCategory, brand: selectedBrand });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Form onSubmit={handleSubmit} className='mb-3'>
      <h5 className='text-black'>LỌC SẢN PHẨM</h5>
      <Row className='align-items-end'>
        <Row md={12}>
          <Form.Group controlId='filterCategory'>
            <Form.Label className='text-black'>
              <h6>
                <BiGridAlt /> Phân loại
              </h6>
            </Form.Label>
            <Form.Control
              as='select'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value=''>Chọn phân loại</option>
              {data?.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Row>
        <Row md={12} className='my-4'>
          <Form.Group controlId='filterBrand'>
            <Form.Label className='text-black'>
              <h6>
                <SiBrandfolder /> Thương hiệu
              </h6>
            </Form.Label>
            <Form.Control
              as='select'
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value=''>Chọn thương hiệu</option>
              {data?.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Row>
        <Row md={12}>
          <div className='d-flex justify-content-center'>
            <Button type='submit' className='button'>
              <b>Lọc</b>
            </Button>
          </div>
        </Row>
      </Row>
    </Form>
  );
};

export default FilterComponent;
