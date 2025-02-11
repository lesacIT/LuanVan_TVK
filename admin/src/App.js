import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideMenu from './components/SideMenu';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <>
      <div className='App'>
        <ToastContainer />
        <div className='Header' style={{marginLeft: "145px"}}>
          <Header />
        </div>
        <div className='SideMenuAndPageContent'>
          <div className='SideMenu'>
            <SideMenu></SideMenu>
          </div>
          <div className='Content'>
            <div className='MainContent'>
              <Container style={{marginLeft: "180px", marginTop: "80px"}}>
                <Outlet />
              </Container>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default App;
