import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/api';
import ProductTable from './ProductTable';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products on component mount
    getProducts().then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <ProductTable products={products} />
    </div>
  );
};

export default ProductList;
