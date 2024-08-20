import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Members from './components/Members';
import Home from './components/Home';
import ShowProducts from './components/ShowProduct';
import CreateCategory from './components/CreateCategory';
import Addproducts from './components/AddProduct';
import ProductDetails from './components/ProductDetails';

const Admin = lazy(() => import('./components/Admin'));

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/members" element={<Members />} />

            <Route path="/show-products" element={<ShowProducts />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            
            <Route path="/admin/*" element={<Admin />} >
              <Route path="create-category" element={<CreateCategory />} />
              <Route path="add-product" element={<Addproducts />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
