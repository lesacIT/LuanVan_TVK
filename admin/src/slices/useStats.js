import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';

//Thống kê tổng số tiền đơn hàng từ trước đến nay
const useCalculateTotalRevenue = () => {
  const [totalRevenueAll, setTotalRevenueAll] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/stats/total-revenue')
      .then((response) => {
        setTotalRevenueAll(response.data.totalRevenue || 0);
      })
      .catch((error) => {
        setError(
          error.response ? error.response.data.message : 'Error fetching data'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { totalRevenueAll, loading, error };
};

//Thống kê tổng doanh thu từ trước đến nay
const CalculateTotalRevenuePaid = () => {
  const [totalRevenuePaid, setTotalRevenuePaid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/stats/total-revenue-paid')
      .then((response) => {
        setTotalRevenuePaid(response.data.totalRevenue || 0);
      })
      .catch((error) => {
        setError(
          error.response ? error.response.data.message : 'Error fetching data'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { totalRevenuePaid, loading, error };
};

//Thống kê đơn tổng đơn hàng từ trước đến nay
const useTotalOrdersCumulative = () => {
  const [totalOrdersAll, setTotalOrdersAll] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/stats/total-orders-cumulative')
      .then((response) => {
        setTotalOrdersAll(response.data.totalOrdersCumulative || 0);
      })
      .catch((error) => {
        setError(
          error.response ? error.response.data.message : 'Error fetching data'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { totalOrdersAll, loading, error };
};

//Thống kê đơn tổng đơn hàng đã thanh toán từ trước đến nay
const TotalOrdersCumulativePaid = () => {
  const [totalOrdersPaid, setTotalOrdersPaid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/stats/total-orders-paid')
      .then((response) => {
        setTotalOrdersPaid(response.data.totalOrdersCumulativePaid || 0);
      })
      .catch((error) => {
        setError(
          error.response ? error.response.data.message : 'Error fetching data'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { totalOrdersPaid, loading, error };
};

//Thống kê số đơn hàng theo khoảng thời gian
const TotalOrders = ({ startDate, endDate }) => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/stats/total-orders', {
          params: { startDate, endDate },
        });
        setTotalOrders(response.data.totalOrders || 0);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalOrders();
  }, [startDate, endDate]);

  return (
    <>
      <div className='d-flex p-3 justify-content-between align-items-end flex-grow-1 p-3 roudned-3 totalOrdTime'>
        <div>
          <p className=''>Đơn hàng theo khoảng thời gian</p>
          <h5 className='mb-0'>
            {loading ? (
              <div>Đang tải...</div>
            ) : error ? (
              <div className='alert alert-danger'>{error}</div>
            ) : (
              <div>{totalOrders}</div>
            )}
          </h5>
        </div>
      </div>
    </>
  );
};

//Thống kê doanh thu theo khoảng thời gian
const RevenueByTimeRange = ({ startDate, endDate }) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/stats/revenue-by-time-range', {
          params: { startDate, endDate },
        });
        setTotalRevenue(response.data.totalRevenue || 0);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalRevenue();
  }, [startDate, endDate]);

  return (
    <>
      <div className='d-flex p-3 justify-content-between align-items-end flex-grow-1 p-3 roudned-3 totalRevenueTime'>
        <div>
          <p className=''>Doanh thu theo khoảng thời gian</p>
          <h5 className='mb-0'>
            {loading ? (
              <div>Đang tải...</div>
            ) : error ? (
              <div className='alert alert-danger'>{error}</div>
            ) : (
              <div>
                {totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </div>
            )}
          </h5>
        </div>
      </div>
    </>
  );
};

//Thống kê sản phẩm bán chạy
const useBestSellingProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/stats/best-selling')
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        setError(
          error.response ? error.response.data.message : 'Error fetching data'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { product, loading, error };
};

const BestSellingProduct = () => {
  const { product, loading, error } = useBestSellingProduct();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className='d-flex p-3 justify-content-between align-items-end flex-grow-1 p-3 roudned-3 bestselling'>
        <div>
          <p className=''>SẢN PHẨM BÁN CHẠY NHẤT</p>
          <h5 className='mb-0'>{product.name}</h5>
        </div>
        <div className='d-flex flex-column align-items-end'>
          <p className='mb-0'>Đã bán: {product.totalSold}</p>
        </div>
      </div>
    </>
  );
};

// Thống kê doanh thu theo phân loại
const useRevenueByCategory = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/stats/revenue-by-category')
      .then((response) => {
        setRevenueData(response.data);
      })
      .catch((error) => {
        setError(
          error.response ? error.response.data.message : 'Error fetching data'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { revenueData, loading, error };
};

const RevenueByCategory = () => {
  const { revenueData, loading, error } = useRevenueByCategory();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Doanh Thu Theo Danh Mục Sản Phẩm</Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Danh Mục</th>
              <th>Doanh Thu Doanh mục</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>
                  {item.totalRevenue
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                  VNĐ
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

const useGrowthData = ({ startDate, endDate, type }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/stats/growth`, {
          params: { startDate, endDate, type },
        });
        console.log('Data fetched:', response.data);
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error(
          'Error fetching data:',
          error.response ? error.response.data : error.message
        );
        setError('Error loading data!');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, type]);

  return { data, loading, error };
};

export {
  useBestSellingProduct,
  BestSellingProduct,
  useRevenueByCategory,
  RevenueByCategory,
  useGrowthData,
  TotalOrders,
  useTotalOrdersCumulative,
  useCalculateTotalRevenue,
  RevenueByTimeRange,
  CalculateTotalRevenuePaid,
  TotalOrdersCumulativePaid,
};
