import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';

const Navbar = () => {
  const [adminView, setAdminView] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setAdminView(false);
    }
  }, [user]);

  const handleAdminClick = () => {
    setAdminView(!adminView);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333', color: 'white' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/show-products">Show Products</Button>
          
        </Box>
        {user ? (
          <>
            <Button color="inherit" onClick={handleAdminClick}>
              Admin
            </Button>
            {adminView && (
              <Box >
                <Button color="inherit" component={Link} to="/members">Member </Button>
                <Button color="inherit" component={Link} to="/admin/addProduct">Add Product</Button>
                <Button color="inherit" component={Link} to="/admin/createCategory">Create Category</Button>
              </Box>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
