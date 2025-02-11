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
import LoginScreen from './screens/LoginScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import BrandCreateScreen from './screens/admin/BrandCreateScreen';
import BrandListScreen from './screens/admin/BrandListScreen';
import BrandEditScreen from './screens/admin/BrandEditScreen';
import ProductCategoryListScreen from './screens/admin/ProductCategoryListScreen';
import ProductCategoryCreateScreen from './screens/admin/ProductCategoryCreateScreen';
import ProductCategoryEditScreen from './screens/admin/ProductCategoryEditScreen';
import BlogListScreen from './screens/admin/BlogListScreen';
import BlogCreateScreen from './screens/admin/BlogCreateScreen';
import BlogEditScreen from './screens/admin/BlogEditScreen';
import BlogCategoryListScreen from './screens/admin/BlogCategoryListScreen';
import BlogCategoryCreateScreen from './screens/admin/BlogCategoryCreateScreen';
import BlogCategoryEditScreen from './screens/admin/BlogCategoryEditScreen';
import EnquiryListScreen from './screens/admin/EnquiryListScreen';
import EnquiryEditScreen from './screens/admin/EnquiryEditScreen';
import ColorCreateScreen from './screens/admin/ColorCreateScreen';
import ColorListScreen from './screens/admin/ColorListScreen';
import ColorEditScreen from './screens/admin/ColorEditScreen';

import store from './store';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import LoginLayout from './Login';
import CODScreen from './screens/CODScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route element={<PrivateRoute />}>
          <Route index={true} path='/' element={<HomeScreen />} />
          <Route path='/search/:keyword' element={<HomeScreen />} />
          <Route path='/page/:pageNumber' element={<HomeScreen />} />
          <Route
            path='/search/:keyword/page/:pageNumber'
            element={<HomeScreen />}
          />
          {/* Registered users */}

          <Route path='/order/:id' element={<OrderScreen />} />
          <Route path='/ordercod/:id' element={<CODScreen />} />
          <Route path='/profile' element={<ProfileScreen />} />

          {/* Admin users */}
          <Route path='' element={<AdminRoute />}>
            <Route path='/admin/orderlist' element={<OrderListScreen />} />
            <Route path='/admin/productlist' element={<ProductListScreen />} />
            <Route path='/admin/brandlist' element={<BrandListScreen />} />
            <Route
              path='/admin/productcategorylist'
              element={<ProductCategoryListScreen />}
            />
            <Route path='/admin/bloglist' element={<BlogListScreen />} />
            <Route
              path='/admin/blogcategorylist'
              element={<BlogCategoryListScreen />}
            />
            <Route path='/admin/enquirylist' element={<EnquiryListScreen />} />
            <Route path='/admin/colorlist' element={<ColorListScreen />} />
            <Route
              path='/admin/productlist/:pageNumber'
              element={<ProductListScreen />}
            />
            <Route path='/admin/userlist' element={<UserListScreen />} />
            <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
            <Route
              path='/admin/product/:id/edit'
              element={<ProductEditScreen />}
            />
            <Route path='/admin/brand/:id/edit' element={<BrandEditScreen />} />
            <Route path='/admin/blog/:id/edit' element={<BlogEditScreen />} />
            <Route
              path='/admin/enquiry/:id/edit'
              element={<EnquiryEditScreen />}
            />
            <Route
              path='/admin/productcategory/:id/edit'
              element={<ProductCategoryEditScreen />}
            />
            <Route
              path='/admin/blogcategory/:id/edit'
              element={<BlogCategoryEditScreen />}
            />
            <Route path='/admin/color/:id/edit' element={<ColorEditScreen />} />
            <Route
              path='/admin/product/create'
              element={<ProductCreateScreen />}
            ></Route>
            <Route
              path='/admin/brand/create'
              element={<BrandCreateScreen />}
            ></Route>
            <Route
              path='/admin/productcategory/create'
              element={<ProductCategoryCreateScreen />}
            ></Route>
            <Route
              path='/admin/blog/create'
              element={<BlogCreateScreen />}
            ></Route>
            <Route
              path='/admin/blogcategory/create'
              element={<BlogCategoryCreateScreen />}
            ></Route>
            <Route
              path='/admin/color/create'
              element={<ColorCreateScreen />}
            ></Route>
          </Route>
        </Route>
      </Route>
      <Route path='/login' element={<LoginLayout />}>
        <Route index element={<LoginScreen />} />
      </Route>
    </>
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
