import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { useGetBrandsQuery } from '../../slices/brandsApiSlice';
import { useGetProductCategoriesQuery } from '../../slices/pcategoryApiSlice';
import { useGetColorsQuery } from '../../slices/colorApiSlice';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [colors, setColors] = useState([]);
  const [colorQuantities, setColorQuantities] = useState({});
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage] = useUploadProductImageMutation();

  const navigate = useNavigate();
  const { data: brands } = useGetBrandsQuery();
  const { data: productcategories } = useGetProductCategoriesQuery();
  const { data: colorData } = useGetColorsQuery();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setColors(product.colors);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setPreviewImage(product.image);

      // Set color quantities based on product colors
      const colorQuantitiesCopy = {};
      product.colors.forEach((color) => {
        colorQuantitiesCopy[color.title] = color.quantity;
      });
      setColorQuantities(colorQuantitiesCopy);
    }
  }, [product]);

  // Trong hàm handleColorChange
  const handleColorChange = (selectedColor, isChecked, quantity) => {
    // Kiểm tra xem số lượng nhập vào có phải là 0 không
    const isZeroQuantity = quantity === 0;

    const index = colors.findIndex(
      (color) => color.title === selectedColor.title
    );

    const updatedColor = {
      title: selectedColor.title,
      colorCode: selectedColor.colorCode,
      quantity: isChecked && !isZeroQuantity ? quantity : 0,
    };

    if (index === -1 && isChecked && !isZeroQuantity) {
      setColors([...colors, updatedColor]);
    } else if ((index !== -1 && !isChecked) || isZeroQuantity) {
      const newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    } else if (index !== -1 && isChecked) {
      const newColors = [...colors];
      newColors.splice(index, 1, updatedColor);
      setColors(newColors);
    }

    setColorQuantities({
      ...colorQuantities,
      [selectedColor.title]: isChecked && !isZeroQuantity ? quantity : 0,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    e.preventDefault();
    // Kiểm tra nếu bất kỳ trường nào chưa được nhập
    if (!name || !price || !image || !brand || !category || !description || colors.length === 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    
    // Kiểm tra giá sản phẩm lớn hơn 0
    if (price <= 0) {
      toast.error('Giá sản phẩm phải lớn hơn 0.');
      return;
    }
  
    try {
      let totalQuantity = 0;
      for (const colorTitle in colorQuantities) {
        totalQuantity += parseInt(colorQuantities[colorTitle]);
      }

      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        colors,
        description,
        countInStock: totalQuantity,
      }).unwrap();
      toast.success('Đã cập nhật sản phẩm');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setPreviewImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Container>
        <Row className='align-items-center'>
          <Col>
            <Link to='/admin/productlist'>
              <IoArrowBack className='icon-container' size={30} />
            </Link>
          </Col>
        </Row>
        <h4 className='text-black text-center'>CHỈNH SỬA SẢN PHẨM</h4>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6} style={{ height: '100%' }}>
                <Form.Group controlId='name'>
                  <Form.Label className='text-black'>Tên sản phẩm</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Nhập tên sản phẩm'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='price'>
                  <Form.Label className='my-2 text-black'>
                    Giá sản phẩm
                  </Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Nhập giá sản phẩm'
                    value={price}
                    onChange={(e) => {
                      const inputPrice = parseFloat(e.target.value);
                      if (inputPrice > 0 || e.target.value === '') {
                        // Cho phép người dùng xóa giá trị
                        setPrice(inputPrice);
                      }
                    }}
                    required
                  />
                </Form.Group>

                <Form.Group controlId='colors'>
                  <Form.Label className='my-2 text-black'>Màu sắc</Form.Label>
                  <div className='d-flex flex-wrap'>
                    {colorData &&
                      colorData.map((colorItem) => (
                        <div key={colorItem.id} className='mt-2 mb-4'>
                          <Form.Check
                            type='checkbox'
                            label={`${colorItem.title} - ${colorItem.colorCode}`}
                            checked={colors.some(
                              (c) => c.title === colorItem.title
                            )}
                            onChange={(e) =>
                              handleColorChange(
                                colorItem,
                                e.target.checked,
                                colorQuantities[colorItem.title] || 1
                              )
                            }
                          />
                          <Form.Control
                            type='number'
                            placeholder='Số lượng'
                            value={colorQuantities[colorItem.title] || 0}
                            onChange={(e) => {
                              const inputValue = parseInt(e.target.value);
                              // Kiểm tra nếu giá trị nhập vào là số âm, không thay đổi state
                              if (inputValue < 0) return;
                              // Nếu không, thực hiện thay đổi state colorQuantities
                              handleColorChange(
                                colorItem,
                                true,
                                inputValue
                              );
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} style={{ height: '100%' }}>
                <Form.Group controlId='category'>
                  <Form.Label className='mb-2 text-black'>Danh mục</Form.Label>
                  <Form.Control
                    as='select'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value=''>Chọn danh mục</option>
                    {productcategories &&
                      productcategories.map((category) => (
                        <option key={category.id} value={category.title}>
                          {category.title}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId='brand'>
                  <Form.Label className='my-2 text-black'>
                    Thương hiệu
                  </Form.Label>
                  <Form.Control
                    as='select'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  >
                    <option value=''>Chọn thương hiệu</option>
                    {brands &&
                      brands.map((brand) => (
                        <option key={brand.id} value={brand.title}>
                          {brand.title}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                  <Form.Label className='text-black my-2'>Mô tả</Form.Label>
                  <ReactQuill
                    theme='snow'
                    value={description}
                    onChange={setDescription}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='image'>
                  <Form.Label column className=' text-black'>
                    Hình ảnh
                  </Form.Label>
                  <Row>
                    <Col xs={8}>
                      <Form.Control
                        multiple
                        label='Chọn tệp'
                        onChange={uploadFileHandler}
                        type='file'
                      />
                    </Col>
                    <Col xs={4}>
                      <div
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          height: '45px',
                        }}
                      >
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt='Preview'
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        ) : (
                          <div
                            style={{
                              textAlign: 'center',
                              fontStyle: 'italic',
                              color: '#888',
                              paddingTop: '10px',
                            }}
                          >
                            Ảnh bài viết
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <Container className='text-center my-4'>
              <Button type='submit' className='button'>
                Cập nhật sản phẩm
              </Button>
            </Container>
          </Form>
        )}
      </Container>
    </>
  );
};

export default ProductEditScreen;
