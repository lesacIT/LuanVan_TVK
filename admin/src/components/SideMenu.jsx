import {
  DashboardOutlined,
  EditOutlined,
  LogoutOutlined,
  ShopOutlined,
  SolutionOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { LuMailQuestion } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';

const { SubMenu } = Menu;

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState('/');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className='SideMenu'>
        <Menu
          className='SideMenuVertical'
          mode='vertical'
          onClick={(item) => {
            navigate(item.key);
          }}
          selectedKeys={[selectedKeys]}
        >
          <div className='logo'>
            <h4 className='text-white fs-5 text-center py-3 mb-0'>
              <span className='lg-logo'>BabyBoo </span>
            </h4>
          </div>
          <Menu.Item key='/' icon={<DashboardOutlined />} className='my-3'>
            Tổng quan
          </Menu.Item>
          <SubMenu
            key='sub1'
            icon={<ShopOutlined />}
            title='Sản phẩm'
            className='my-3'
          >
            <Menu.Item key='/admin/productlist'>Danh sách sản phẩm</Menu.Item>
            <Menu.Item key='/admin/product/create'>Thêm sản phẩm</Menu.Item>
            <Menu.Item key='/admin/brandlist'>Danh sách thương hiệu</Menu.Item>
            <Menu.Item key='/admin/brand/create'>Thêm thương hiệu</Menu.Item>
            <Menu.Item key='/admin/productcategorylist'>
              Danh sách danh mục
            </Menu.Item>
            <Menu.Item key='/admin/productcategory/create'>
              Thêm danh mục
            </Menu.Item>
            <Menu.Item key='/admin/colorlist'>Danh sách màu sắc</Menu.Item>
            <Menu.Item key='/admin/color/create'>Thêm màu sắc</Menu.Item>
          </SubMenu>

          <SubMenu
            key='sub2'
            icon={<EditOutlined />}
            title='Bài viết'
            className='my-3'
          >
            <Menu.Item key='/admin/bloglist'>Danh sách bài viết</Menu.Item>
            <Menu.Item key='/admin/blog/create'>Thêm bài viết</Menu.Item>
            <Menu.Item key='/admin/blogcategorylist'>
              Danh sách chủ đề
            </Menu.Item>
            <Menu.Item key='/admin/blogcategory/create'>Thêm chủ đề</Menu.Item>
          </SubMenu>

          <Menu.Item
            key='/admin/orderlist'
            icon={<SolutionOutlined />}
            className='my-3'
          >
            Đơn hàng
          </Menu.Item>
          <Menu.Item
            key='/admin/userlist'
            icon={<UserOutlined />}
            className='my-3'
          >
            Người dùng
          </Menu.Item>
          <Menu.Item
            key='/admin/enquirylist'
            icon={<LuMailQuestion />}
            className='my-3'
          >
            Yêu cầu
          </Menu.Item>
          <Menu.Item
            key='/logout'
            icon={<LogoutOutlined />}
            className='my-3'
            onClick={logoutHandler}
          >
            Đăng xuất
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
}

export default SideMenu;
