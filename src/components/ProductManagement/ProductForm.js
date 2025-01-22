import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../services/api';
import { Button, Container, Box, Typography,TextField   } from '@mui/material'; 


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
<Container maxWidth="sm"> 
  <Box sx={{ mt: 4 }}>
     <Typography variant="h4"
   component="h1" gutterBottom>
     {productId ? 'Edit Product' : 'Add Product'}
     </Typography> 
     <form onSubmit={handleSubmit}>  
    
       <TextField
        fullWidth 
        margin="normal" 
       label="Name" 
       variant="outlined"
        value={product.name}
         onChange={(e) => setProduct({ ...product, name: e.target.value })} /> 
        <TextField 
        fullWidth margin="normal"
         label="Price"
          variant="outlined"
           type="number"
            value={product.price} 
            onChange={(e) => setProduct({ ...product, price: e.target.value })} /> 
            <TextField fullWidth margin="normal"
             label="Stock"
              variant="outlined" 
              type="number" 
              value={product.stock} 
              onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
   
             <Button type="submit" color="primary" variant="contained">
           Save
           </Button>
            </form>
         </Box>
          </Container>    
   
  );
};

export default ProductForm;
