// LoginLayout.js
import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const LoginLayout = () => {
  return (
    <>
      <Container>
        <ToastContainer />
        <Outlet />
      </Container>
    </>
  );
};

export default LoginLayout;
