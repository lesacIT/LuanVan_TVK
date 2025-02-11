import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';


const Header = () => {
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
      <header className='header-upper'>
        <Navbar style={{height: '60px'}} variant='dark' collapseOnSelect>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto' style={{ paddingRight: '50px' }}>
                {userInfo ? (
                  <>
                    <Nav className='d-flex align-items-center'>
                      <NavDropdown
                        title={
                          <>
                            <FaUser className='mx-1'/> {userInfo.name}
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
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <FaUser /> Đăng nhập
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
