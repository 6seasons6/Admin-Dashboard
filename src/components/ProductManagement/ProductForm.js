import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../services/api';

const ProductForm = ({ productId, onSave }) => {
  const [product, setProduct] = useState({ name: '', price: '', stock: '' });

  useEffect(() => {
    if (productId) {
      // Fetch product data to edit if productId is provided
    }
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productId) {
      updateProduct(productId, product).then(() => onSave());
    } else {
      addProduct(product).then(() => onSave());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="Name"
      />
      <input
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        placeholder="Price"
      />
      <input
        type="number"
        value={product.stock}
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        placeholder="Stock"
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default ProductForm;
