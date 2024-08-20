import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, CircularProgress, Box, Typography, Snackbar, Alert, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

  const formik = useFormik({
    initialValues: {
      displayName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required('Display Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values)).then(() => {
        if (user) {
          setSnackbarMessage('Registration successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (error) {
          setSnackbarMessage(error);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      });
    }
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#e3f2fd"
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, maxWidth: 400, width: '100%', bgcolor: 'azure', borderRadius: 2 }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            label="Display Name"
            name="displayName"
            fullWidth
            margin="normal"
            value={formik.values.displayName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.displayName && Boolean(formik.errors.displayName)}
            helperText={formik.touched.displayName && formik.errors.displayName}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Register;
