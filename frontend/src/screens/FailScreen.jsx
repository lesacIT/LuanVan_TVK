import React from 'react';
import { useParams } from 'react-router-dom';
import { usePayOrderMutation } from '../slices/ordersApiSlice';
import fail from '../assets/Error.gif'; // Đường dẫn tới tệp SVG

const FailScreen = () => {
  const { orderId } = useParams();
  const [payOrder, { isLoading, isError }] = usePayOrderMutation();

  const handlePayOrder = () => {
    // Logic để xử lý thanh toán
    payOrder(orderId);
  };

  return (
    <>
      <div>
        <div className='d-flex justify-content-center mt-5'>
          <img style={{ width: '400px' }} src={fail} alt='VNPay Logo' />
        </div>{' '}
        <div style={{ color: 'red' }} className='d-flex justify-content-center'>
          <h2>THANH TOÁN THẤT BẠI</h2>
        </div>
      </div>
    </>
  );
};

export default FailScreen;
