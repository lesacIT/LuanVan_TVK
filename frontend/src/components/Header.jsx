import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaTachometerAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className='header-top-strip py-3'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-6'>
              <p className='text-white mb-0'>
                Miễn phí vận chuyển và thanh toán trực tiếp
              </p>
            </div>
            <div className='col-6'>
              <p className='text-end text-white mb-0'>
                Hotline:{' '}
                <a className='text-white' href='tel:+84 946053795'>
                  +84 946053795
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>
      <header className='header-upper'>
        <Navbar variant='dark' expand='lg' collapseOnSelect>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>
                <h3>
                  <Link to='/' className='text-white mt-2'>
                    <img
                      width={200}
                      src='https://res.cloudinary.com/dugpxqp6x/image/upload/v1713680477/tlipstick-high-resolution-logo-transparent_1_xbdy4q.png'
                    ></img>
                  </Link>
                </h3>
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto'>
                <div style={{ marginRight: '140px' }}>
                  <SearchBox />
                </div>
                <Nav className='d-flex align-items-center me-2'>
                  <LinkContainer to='/cart'>
                    <Nav.Link>
                      <FaShoppingCart style={{ fontSize: '1.5em' }} className='me-1' /> Giỏ Hàng
                      {cartItems.length > 0 && (
                        <Badge pill bg='danger' style={{ marginLeft: '5px', fontSize:"12px" }}>
                          {cartItems.reduce((a, c) => a + c.qty, 0)}
                          
                        </Badge>
                      )}
                    </Nav.Link>
                  </LinkContainer>
                </Nav>

                {userInfo ? (
                  <>
                    <Nav className='d-flex align-items-center justify-content-end flex-grow-1'>
                      <NavDropdown
                        title={
                          <>
                            <FaUser style={{ fontSize: '1.3em' }} className='me-1'/>
                            {userInfo.name}
                          </>
                        }
                        id='username'
                      >
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item>Trang cá nhân</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={logoutHandler}>
                          Đăng xuất
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </>
                ) : (
                  <LinkContainer to='/login' style={{marginTop: "3px"}}>
                    <Nav.Link >
                      <FaUser style={{ fontSize: '1.3em' }} className='me-1' /> Đăng nhập
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <header className='header-bottom py-3'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-12 d-flex justify-content-center'>
              <div className='menu-bottom d-flex align-items-center gap-30'>
                <div className='menu-links'>
                  <div className='d-flex align-items-center gap-30'>
                    <NavLink to='/'>Trang Chủ</NavLink>
                    <NavLink to='/store'>Cửa Hàng</NavLink>
                    <NavLink to='/blog'>Bài Viết</NavLink>
                    <NavLink to='/about'>Giới Thiệu</NavLink>
                    <NavLink to='/contact'>Liên Hệ</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
