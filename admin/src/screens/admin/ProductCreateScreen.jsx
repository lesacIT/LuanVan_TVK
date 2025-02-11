import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { useGetBrandsQuery } from '../../slices/brandsApiSlice';
import { useGetProductCategoriesQuery } from '../../slices/pcategoryApiSlice';
import { useGetColorsQuery } from '../../slices/colorApiSlice';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const ProductCreateScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState([]);
  const [colorQuantities, setColorQuantities] = useState({});
  const [previewImage, setPreviewImage] = useState('');
  const [createProduct, { isLoading, error }] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const navigate = useNavigate();
  const { data: brands, isLoading: brandsLoading } = useGetBrandsQuery();

  const { data: productcategories, isLoading: productcategoriesLoading } =
    useGetProductCategoriesQuery();

  const { data: color, isLoading: colorsLoading } = useGetColorsQuery();

  useEffect(() => {}, []);

  useEffect(() => {
    console.log('Số lượng của từng màu sắc:', colorQuantities);
  }, [colorQuantities]);
  const handleColorChange = (selectedColor, isChecked, quantity) => {
    // Kiểm tra xem số lượng nhập vào có phải là 0 không
    const isZeroQuantity = quantity === 0;

    const index = colors.findIndex(
      (color) => color.title === selectedColor.title
    );

    // Tạo một object mới để lưu trữ thông tin màu sắc và số lượng
    const updatedColor = {
      title: selectedColor.title,
      colorCode: selectedColor.colorCode,
      quantity: isChecked && !isZeroQuantity ? quantity : 0, // Nếu isChecked là true và số lượng không phải là 0, sử dụng số lượng mới; ngược lại, sử dụng 0
    };
    if (index === -1 && isChecked && !isZeroQuantity) {
      // Nếu màu sắc chưa được chọn, được chọn, và số lượng không phải là 0, thêm màu sắc mới vào mảng với số lượng được chọn
      setColors([...colors, updatedColor]);
    } else if ((index !== -1 && !isChecked) || isZeroQuantity) {
      // Nếu màu sắc đã được chọn và bị bỏ chọn, hoặc số lượng là 0, xóa màu sắc đó khỏi mảng
      const newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    } else if (index !== -1 && isChecked) {
      // Nếu màu sắc đã được chọn và được chọn lại, cập nhật lại số lượng theo giá trị số lượng được truyền vào
      const newColors = [...colors];
      newColors.splice(index, 1, updatedColor);
      setColors(newColors);
    }

    // Cập nhật số lượng cho mỗi màu sắc
    setColorQuantities({
      ...colorQuantities,
      [selectedColor.title]: isChecked && !isZeroQuantity ? quantity : 0, // Cập nhật số lượng là 0 nếu màu sắc bị bỏ chọn hoặc số lượng là 0, ngược lại là số lượng mới
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu bất kỳ trường nào chưa được nhập
    if (
      !name ||
      !price ||
      !image ||
      !brand ||
      !category ||
      !description ||
      colors.length === 0
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    // Kiểm tra giá sản phẩm lớn hơn 0
    if (price <= 0) {
      toast.error('Giá sản phẩm phải lớn hơn 0.');
      return;
    }

    try {
      // Tính tổng số lượng từ màu sắc
      let totalQuantity = 0;
      for (const colorTitle in colorQuantities) {
        totalQuantity += parseInt(colorQuantities[colorTitle]);
      }

      console.log('countInStock:', totalQuantity);

      const res = await createProduct({
        name,
        price,
        image,
        brand,
        category,
        description,
        colors,
        countInStock: totalQuantity,
      }).unwrap();
      toast.success('Đã tạo sản phẩm');
      navigate(`/admin/productlist`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);

      // Hiển thị hình ảnh đã chọn
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
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
        <h4 className='text-black text-center'>THÊM SẢN PHẨM</h4>
        {isLoading || (productcategoriesLoading && <Loader />)}
        {isLoading || (brandsLoading && <Loader />)}
        {error && <Message variant='danger'>{error.data.message}</Message>}
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
                  {color &&
                    color.map((colorItem) => (
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
                              e.target.checked, // Truyền vào trạng thái của checkbox (true hoặc false)
                              colorQuantities[colorItem.title] || 1 // Truyền vào số lượng, mặc định là 1 nếu chưa được chọn
                            )
                          }
                        />
                        {/* Thêm input số lượng cho mỗi màu sắc */}
                        <Form.Control
                          type='number'
                          placeholder='Số lượng'
                          value={colorQuantities[colorItem.title] || 0} // Sử dụng giá trị số lượng từ state colorQuantities, mặc định là 0 nếu chưa được chọn
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
                <Form.Label className='my-2 text-black'>Thương hiệu</Form.Label>
                <Form.Control
                  as='select'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                >
                  <option value=''>Chọn thương hiệu</option>
                  {brands &&
                    brands.map(
                      (
                        brand // Kiểm tra xem brands đã được tải chưa
                      ) => (
                        <option key={brand.id} value={brand.title}>
                          {brand.title}
                        </option>
                      )
                    )}
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
                      required
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
              Tạo sản phẩm
            </Button>
          </Container>
        </Form>
      </Container>
    </>
  );
};

export default ProductCreateScreen;
