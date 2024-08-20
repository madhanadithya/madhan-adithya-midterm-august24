import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const AddProducts = lazy(() => import('./AddProduct'));
const CreateCategory = lazy(() => import('./CreateCategory'));

function Admin() {
  return (
    <div>
      <h1>Admin Page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/addProduct" element={<AddProducts />} />
          <Route path="/createCategory" element={<CreateCategory />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default Admin;
