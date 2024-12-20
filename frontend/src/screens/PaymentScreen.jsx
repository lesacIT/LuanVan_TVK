import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";

const PaymentScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('VNPay');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <>
      <Meta title={"Thanh Toán"} />
      <BreadCrumb title="Thanh Toán" />
      <Link to='/shipping'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h3 className='payment text-center'>PHƯƠNG THỨC THANH TOÁN</h3>
        <Form onSubmit={submitHandler}>
          <Form.Group className='text-black'>
            <Form.Label as='legend'>
              <h5>Vui lòng chọn phương thức thanh toán</h5>
            </Form.Label>
            <Col>
              <Form.Check
                className='my-2'
                type='radio'
                label='Thanh toán qua cổng VNPay'
                id='VNPay'
                name='paymentMethod'
                value='VNPay'
                checked={paymentMethod === 'VNPay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
              <Form.Check
                className='my-2'
                type='radio'
                label='Thanh toán khi nhận hàng'
                id='COD'
                name='paymentMethod'
                value='COD'
                // checked={paymentMethod === 'Thanh toán trực tiếp'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <div className='text-center'>
            <Button type='submit' className='button my-4'>
              Đi đến xác nhận
            </Button>
          </div>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
