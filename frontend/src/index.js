import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import StoreScreen from './screens/StoreScreen';

import SingleBlogScreen from './screens/SingleBlogScreen';
import BlogScreen from './screens/BlogScreen';
import EnquiryDetails from './screens/EnquiryDetails';

import SucccessScreen from './screens/SuccessScreen';
import FailScreen from './screens/FailScreen';

import About from './screens/AboutScreen';
import Contact from './screens/ContactSreen';
import PrivacyPolicy from './screens/PrivacyPolicy';
import RefundPolicy from './screens/RefundPolicy';
import ShippingPolicy from './screens/ShippingPolicy';
import TermAndConditions from './screens/TermAndConditions';
import CODScreen from './screens/CODScreen';

import store from './store';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<StoreScreen />} />
      <Route path='/page/:pageNumber' element={<StoreScreen />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<StoreScreen />}
      />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/about' element={<About />} />

      <Route path='/store' element={<StoreScreen />} />

      <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      <Route path='/refund-policy' element={<RefundPolicy />} />
      <Route path='/shipping-policy' element={<ShippingPolicy />} />
      <Route path='/termandconditions' element={<TermAndConditions />} />
      <Route path='/blog' element={<BlogScreen />} />
      <Route path='/blog/:id' element={<SingleBlogScreen />} />

      {/* Registered users */}

      <Route path='' element={<PrivateRoute />}>
        <Route path='/payment-success' element={<SucccessScreen /> }/>
        <Route path='/payment-fail' element={<FailScreen /> }/>
        <Route path='/contact' element={<Contact />} />
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/ordercod/:id' element={<CODScreen />} />
        <Route path='/enquiry/:id' element={<EnquiryDetails />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
