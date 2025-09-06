import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import config from './config.js';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null); // store ID internally for updates

  const baseUrl = `${config.url}`;

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setProducts(res.data);
    } catch (error) {
      setMessage('Failed to fetch products.');
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = () => {
    for (let key in product) {
      if (!product[key] || product[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  // Add product
  const addProduct = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, product);
      setMessage('Product added successfully.');
      fetchAllProducts();
      resetForm();
    } catch (error) {
      setMessage('Error adding product.');
    }
  };

  // Update product (send ID in body, not URL)
  const updateProduct = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, { id: editId, ...product }); // ✅ send ID in body
      setMessage('Product updated successfully.');
      fetchAllProducts();
      resetForm();
    } catch (error) {
      setMessage('Error updating product.');
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllProducts();
    } catch (error) {
      setMessage('Error deleting product.');
    }
  };

  // Get product by ID
  const getProductById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedProduct(res.data);
      setMessage('');
    } catch (error) {
      setFetchedProduct(null);
      setMessage('Product not found.');
    }
  };

  // Handle edit
  const handleEdit = (prod) => {
    const { id, ...rest } = prod;
    setProduct(rest);
    setEditId(id);
    setEditMode(true);
    setMessage(`Editing product with ID ${id}`);
  };

  // Reset form
  const resetForm = () => {
    setProduct({
      name: '',
      price: '',
      description: '',
      stock: '',
      category: ''
    });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="student-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Product Management</h2>

      {/* Add / Edit Form */}
      <div>
        <h3>{editMode ? 'Edit Product' : 'Add Product'}</h3>
        <div className="form-grid">
          <input type="text" name="name" placeholder="Name" value={product.name} onChange={handleChange} />
          <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} />
          <input type="text" name="description" placeholder="Description" value={product.description} onChange={handleChange} />
          <input type="number" name="stock" placeholder="Stock" value={product.stock} onChange={handleChange} />
          <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addProduct}>Add Product</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateProduct}>Update Product</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      {/* Get by ID */}
      <div>
        <h3>Get Product By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getProductById}>Fetch</button>

        {fetchedProduct && (
          <div>
            <h4>Product Found:</h4>
            <pre>{JSON.stringify(fetchedProduct, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* All Products */}
      <div>
        <h3>All Products</h3>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.name}</td>
                    <td>{prod.price}</td>
                    <td>{prod.description}</td>
                    <td>{prod.stock}</td>
                    <td>{prod.category}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(prod)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteProduct(prod.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;
