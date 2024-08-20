import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Home = () => {
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
                sx={{ padding: 4, maxWidth: 600, width: '100%', backgroundColor: '#e3f2fd' }}
            >
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Welcome to our site....!.!
                </Typography>
            </Paper>
        </Box>
    );
};

export default Home;



