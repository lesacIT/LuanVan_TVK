import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetColorDetailsQuery,
  useUpdateColorMutation,
} from '../../slices/colorApiSlice';
import { IoArrowBack } from 'react-icons/io5';
import CustomInput from '../../components/CustomInput';

const ColorEditScreen = () => {
  const { id: colorId } = useParams();
  const [title, setTitle] = useState('');
  const [colorCode, setColorCode] = useState('');

  const {
    data: color,
    isLoading,
    refetch,
    error,
  } = useGetColorDetailsQuery(colorId);

  const [updateColor, { isLoading: loadingUpdate }] = useUpdateColorMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu trường 'title' hoặc 'colorCode' không được điền vào
    if (!title.trim() || !colorCode.trim()) {
      toast.error('Vui lòng nhập tên màu và chọn mã màu');
      return;
    }

    try {
      await updateColor({
        colorId,
        title,
        colorCode,
      }).unwrap(); // Unwrap the Promise to catch any rejection in the catch block
      toast.success('Đã cập nhật màu sắc');
      refetch();
      navigate('/admin/colorlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    console.log('Color:', color);
    if (color) {
      setTitle(color.title);
      setColorCode(color.colorCode);
    }
  }, [color]);

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <Link to='/admin/colorlist'>
            <IoArrowBack className='icon-container' size={30} />
          </Link>
        </Col>
      </Row>
      <FormContainer>
        <h3 className='text-black text-center'>CHỈNH SỬA MÀU SẮC</h3>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='title'>
              <Form.Label className='text-black'>Tên màu</Form.Label>
              <Form.Control
                type='text'
                placeholder='Nhập tên màu'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='color' className='my-3'>
              <Form.Label className='text-black'>Mã màu</Form.Label>
              <CustomInput
                type='color'
                placeholder='Chọn màu'
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
              />
            </Form.Group>

            <Container className='text-center'>
              <Button
                type='submit'
                className='button my-4'
                style={{ marginTop: '1rem' }}
              >
                Cập nhật
              </Button>
            </Container>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ColorEditScreen;
