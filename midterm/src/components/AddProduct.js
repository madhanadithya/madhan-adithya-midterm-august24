import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './AddProduct.css';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

function Addproducts() {
  let [categories, setCategories] = useState([]);
  let [generatedCode, setGeneratedCode] = useState("");

  let Navigate = useNavigate();

  useEffect(function () {
    axios
      .get(`http://localhost:3000/api/v1/categories`)
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        alert("Server is not responding. Please try again later.");
        console.error(error);
      });
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Product name is required")
      .min(3, "Product name must be at least 3 characters")
      .max(30, "Product name cannot exceed 30 characters"),
    code: Yup.string().required("Product code is required"),
    excerpt: Yup.string()
      .required("Product description is required")
      .min(30, "Product description must be at least 30 characters")
      .max(500, "Product description cannot exceed 500 characters"),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number")
      .max(100000, "Price cannot exceed 100,000"),
    stock: Yup.number()
      .required("Stock is required")
      .integer("Stock must be an integer")
      .min(0, "Stock cannot be negative"),
  });

  const generateUniqueCode = () => {
    const uuid = uuidv4();
    const uniqueCode = uuid.slice(0, 6).toUpperCase();
    setGeneratedCode(uniqueCode);
  };

  return (
    <div className="addproducts">
      <h2> Add Products </h2>
      <Formik
        initialValues={{
          name: "",
          code: generatedCode, 
          excerpt: "",
          category: "",
          price: 0,
          stock: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          axios
            .post("http://localhost:3000/api/v1/products", values)
            .then(function (response) {
              console.log(response);
              Navigate('/ShowProducts');
              resetForm();
            })
            .catch(function (err) {
              console.log(err);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div>
              <Field
                type="text"
                name="name"
                placeholder="Enter Product Name"
              />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <Field
                type="text"
                name="code"
                placeholder="Enter Product Code"
                disabled 
              /><br/><br/>
              <button type="button" onClick={() => {
                generateUniqueCode();
                setFieldValue('code', generatedCode); 
              }}>
                Generate Code
              </button>
              <ErrorMessage name="code" component="div" />
            </div>
            <div>
              <Field
                type="text"
                name="excerpt"
                placeholder="Enter Description of the product"
              />
              <ErrorMessage name="excerpt" component="div" />
            </div>
            <div>
              <Field as="select" name="category">
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" />
            </div>
            <div>
              <Field
                type="number"
                name="price"
                placeholder="Enter the price of your product"
              />
              <ErrorMessage name="price" component="div" />
            </div>
            <div>
              <Field
                type="number"
                name="stock"
                placeholder="Enter the stock quantity"
              />
              <ErrorMessage name="stock" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Addproducts;
