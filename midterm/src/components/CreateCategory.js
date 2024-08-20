
// import React from 'react';
// import axios from 'axios';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
// import './CreateCategory.css'; 

// const validationSchema = Yup.object({
//   name: Yup.string().required('Name is required'),
//   description: Yup.string().required('Description is required')
// });

// const CreateCategory = () => {
//   const navigate = useNavigate();

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       description: ''
//     },
//     validationSchema: validationSchema,
//     onSubmit: (values) => {
//       console.log('Form values:', values); 
//       axios.post('http://localhost:3000/api/v1/categories', values)
//         .then(response => {
//           console.log('Response:', response); 
//           alert('Category Created Successfully!! :)');
//           navigate('/Category'); 
//         })
//         .catch(error => {
//           console.error('Error creating category:', error);
//           alert('Failed to create category. Please try again.'); 
//         });
//     }
//   });

//   return (
//     <div className="create-category-container">
//       <h2>Create Category</h2>
//       <form onSubmit={formik.handleSubmit}>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input
//             id="name"
//             type="text"
//             {...formik.getFieldProps('name')}
//           />
//           {formik.touched.name && formik.errors.name ? (
//             <div className="error">{formik.errors.name}</div>
//           ) : null}
//         </div>
//         <br />
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea
//             id="description"
//             rows={4}
//             cols={36}
//             {...formik.getFieldProps('description')}
//           />
//           {formik.touched.description && formik.errors.description ? (
//             <div className="error">{formik.errors.description}</div>
//           ) : null}
//         </div>
//         <br />
//         <button type="submit">Create</button>
//         <br />
//         <button type="button" onClick={() => navigate('/Category')}>Cancel</button>
//       </form>
//     </div>
//   );
// };

// export default CreateCategory;





import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './CreateCategory.css'; 

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(30, 'Name must be at most 30 characters')
    .required('Name is required'),
  description: Yup.string()
    .min(50, 'Description must be at least 50 characters')
    .max(500, 'Description must be at most 500 characters')
    .required('Description is required')
});

const CreateCategory = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Form values:', values); 
      axios.post('http://localhost:3000/api/v1/categories', values)
        .then(response => {
          console.log('Response:', response); 
          alert('Category Created Successfully!! :)');
          navigate('/Category'); 
        })
        .catch(error => {
          console.error('Error creating category:', error);
          alert('Failed to create category. Please try again.'); 
        });
    }
  });

  return (
    <div className="create-category-container">
      <h2>Create Category</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error">{formik.errors.name}</div>
          ) : null}
        </div>
        <br />
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            rows={4}
            cols={36}
            {...formik.getFieldProps('description')}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="error">{formik.errors.description}</div>
          ) : null}
        </div>
        <br />
        <button type="submit">Create</button>
        <br />
        <button type="button" onClick={() => navigate('/Category')}>Cancel</button>
      </form>
    </div>
  );
};

export default CreateCategory;


