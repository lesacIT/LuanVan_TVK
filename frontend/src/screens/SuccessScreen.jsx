import React from 'react';
import { useParams } from 'react-router-dom';
import { usePayOrderMutation } from '../slices/ordersApiSlice';
import success from '../assets/Success.gif'; // Đường dẫn tới tệp SVG

const SucccessScreen = () => {
  const { orderId } = useParams();
  const [payOrder, { isLoading, isError }] = usePayOrderMutation();

  const handlePayOrder = () => {
    // Logic để xử lý thanh toán
    payOrder(orderId);
  };

  return (
    <>
      <div>
        <div className='d-flex justify-content-center'>
          <img style={{ width: '400px' }} src={success} alt='VNPay Logo' />
        </div>{' '}
        <div style={{ color: 'rgb(4, 172, 4)' }} className='d-flex justify-content-center'>
          <h2>THANH TOÁN THÀNH CÔNG</h2>
        </div>
      </div>
    </>
  );
};

export default SucccessScreen;
