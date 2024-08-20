import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useTable, useGlobalFilter, usePagination, useSortBy, useExpanded } from 'react-table';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import './ShowProducts.css';

function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <TextField
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder="Search by name or description..."
      variant="outlined"
      size="small"
      sx={{ maxWidth: '300px' }} 
      InputProps={{
        endAdornment: <SearchIcon />,
      }}
    />
  );
}

function CategoryFilter({ categories, categoryFilter, setCategoryFilter }) {
  return (
    <FormControl fullWidth variant="outlined" size="small" sx={{ maxWidth: '200px' }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={categoryFilter || ''}
        onChange={(e) => setCategoryFilter(e.target.value)}
        label="Category"
      >
        <MenuItem value="">All Categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category._id} value={category.name}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function PriceRangeFilter({ minPrice, setMinPrice, maxPrice, setMaxPrice }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      <TextField
        type="number"
        value={minPrice || ''}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min price"
        variant="outlined"
        size="small"
        sx={{ maxWidth: '150px' }} 
      />
      <TextField
        type="number"
        value={maxPrice || ''}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max price"
        variant="outlined"
        size="small"
        sx={{ maxWidth: '150px' }} 
      />
    </Box>
  );
}

function ShowProducts() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [adminView, setAdminView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, globalFilter, categoryFilter, minPrice, maxPrice]);

  function fetchProducts() {
    const url = 'http://localhost:3000/api/v1/products';
    axios
      .get(url)
      .then((response) => {
        setData(response.data.products);
      })
      .catch((error) => {
        alert('Server is not responding');
      });
  }

  function fetchCategories() {
    const url = 'http://localhost:3000/api/v1/categories';
    axios
      .get(url)
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }

  function filterData() {
    let filtered = data;

    if (globalFilter) {
      const lowercasedGlobalFilter = globalFilter.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.name ? item.name.toLowerCase().includes(lowercasedGlobalFilter) : false) ||
          (item.excerpt ? item.excerpt.toLowerCase().includes(lowercasedGlobalFilter) : false)
      );
    }

    if (categoryFilter) {
      const lowercasedCategoryFilter = categoryFilter.toLowerCase();
      filtered = filtered.filter((item) =>
        typeof item.category === 'object' && item.category.name.toLowerCase().includes(lowercasedCategoryFilter)
      );
    }

    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      filtered = filtered.filter((item) => item.price >= min && item.price <= max);
    }

    setFilteredData(filtered);
  }

  function viewProductDetails(productId) {
    navigate(`/products/${productId}`);
  }

  function deleteProduct(productId) {
    axios
      .delete(`http://localhost:3000/api/v1/products/${productId}`)
      .then(() => {
        fetchProducts();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleAdminClick = () => {
    setAdminView(!adminView);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Expand',
        id: 'expander',
        Cell: ({ row }) => (
          <IconButton size="small" onClick={() => row.toggleRowExpanded()}>
            {row.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        ),
        width: 50,
      },
      {
        Header: 'Name',
        accessor: 'name',
        sortType: 'basic',
      },
      {
        Header: 'Price',
        accessor: 'price',
        sortType: 'basic',
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) => moment(value).format('DD MMM YYYY'),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" onClick={() => viewProductDetails(row.original._id)}>
              View Details
            </Button>
            <IconButton color="error" onClick={() => deleteProduct(row.original._id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex: tablePageIndex, pageSize: tablePageSize },
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );

  const handlePageChange = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={fetchProducts} sx={{ mr: 1 }}>
          Refresh Products
        </Button>
        {/* <Button variant="contained" color="primary" onClick={handleAdminClick} sx={{ mr: 1 }}>
          {adminView ? 'Hide Admin' : 'Admin'}
        </Button>
        {adminView && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/admin/addProduct')} sx={{ mr: 1 }}>
              Add Product
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/admin/createCategory')}>
              Create Category
            </Button>
          </Box>
        )} */}
      </Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <CategoryFilter categories={categories} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
        <PriceRangeFilter minPrice={minPrice} setMinPrice={setMinPrice} maxPrice={maxPrice} setMaxPrice={setMaxPrice} />
      </Box>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}> 
        <TableContainer component={Paper}>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{ cursor: 'pointer' }}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <React.Fragment key={row.id}>
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                      ))}
                    </TableRow>
                    {row.isExpanded ? (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          <Box sx={{ p: 2 }}>
                            <Typography variant="h6">Detailed Information</Typography>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="subtitle1">Stock: {row.original.stock}</Typography>
                              <Typography variant="subtitle1">Description: {row.original.excerpt}</Typography>
                              <Typography variant="subtitle1">Category Description: {row.original.category.description}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredData.length}
          rowsPerPage={tablePageSize}
          page={tablePageIndex}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  );
}

export default ShowProducts;

