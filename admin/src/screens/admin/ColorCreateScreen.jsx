import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useCreateColorMutation } from '../../slices/colorApiSlice';
import CustomInput from './../../components/CustomInput';

const ColorCreateScreen = () => {
  const [title, setTitle] = useState('');
  const [colorCode, setColorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createColor] = useCreateColorMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu trường 'title' hoặc 'colorCode' không được điền vào
    if (!title.trim() || !colorCode.trim()) {
      toast.error('Vui lòng nhập tên màu và chọn mã màu');
      return;
    }

    setLoading(true);
    try {
      const res = await createColor({ title, colorCode }).unwrap();
      toast.success('Đã tạo màu');
      navigate(`/admin/colorlist`);
    } catch (err) {
      setError(err?.data?.message || err.error);
    }
    setLoading(false);
  };

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
        <h4 className='text-black text-center'>THÊM MÀU SẮC</h4>
        {loading && <Loader />}
        {error && <Message variant='danger'>{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='title'>
            <Form.Label className='text-black'>Tên màu</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập tên màu'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='color' className='my-3'>
            <Form.Label className='text-black'>Mã màu</Form.Label>
            <CustomInput
              type='color'
              placeholder='Chọn màu'
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
            ></CustomInput>
          </Form.Group>

          <Container className='text-center'>
            <Button type='submit' className='button my-3'>
              Tạo màu sắc
            </Button>
          </Container>
        </Form>
      </FormContainer>
    </>
  );
};

export default ColorCreateScreen;
