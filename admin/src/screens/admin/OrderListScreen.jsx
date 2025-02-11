import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';

const OrderListScreen = () => {
  const {
    data: orders,
    isLoading: orderLoading,
    error: orderError,
  } = useGetOrdersQuery();

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (!orderLoading && orders) {
      const updatedOrders = orders.map((order) => ({
        ...order,
        totalQty: order.orderItems.reduce((total, item) => total + item.qty, 0),
      }));
      setOrderData(updatedOrders);
    }
  }, [orderLoading, orders]);

  return (
    <>
      <h4 className='text-black pt-3'>QUẢN LÝ ĐƠN HÀNG</h4>
      {orderLoading ? (
        <Loader />
      ) : orderError ? (
        <Message variant='danger'>
          {orderError?.data?.message || orderError.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>STT</th>
              <th>MÃ ĐƠN HÀNG</th>
              <th>KHÁCH HÀNG</th>
              <th>NGÀY ĐẶT</th>
              <th>SỐ LƯỢNG SẢN PHẨM</th>
              <th>TỔNG</th>
              <th>ĐÃ THANH TOÁN</th>
              <th>ĐÃ XÁC NHẬN</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>
                  {order.createdAt ? (
                    new Date(order.createdAt).toLocaleDateString('vi-VN')
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>{order.totalQty}</td>
                <td>
                  {order.totalPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  VNĐ
                </td>
                <td>
                  {order.isPaid ? (
                    new Date(order.paidAt).toLocaleDateString('vi-VN')
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    new Date(order.deliveredAt).toLocaleDateString('vi-VN')
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer
                    to={`/${
                      order.paymentMethod === 'VNPay' ? 'order' : 'ordercod'
                    }/${order._id}`}
                  >
                    <Button variant='light' className='btn-sm btn details'>
                      Xem chi tiết
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
