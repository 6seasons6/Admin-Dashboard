const API_URL = 'http://localhost:5000/api';

//export const getUsers = () => fetch(`${API_URL}/users`).then((res) => res.json());
export const getUsers = () => {
  return new Promise((resolve) => {
    // Mocked user data
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Editor', status: 'Active' },
      { id: 4, name: 'Mary Brown', email: 'mary@example.com', role: 'User', status: 'Active' },
    ];
    
    // Simulate a delay like an API call
    setTimeout(() => resolve(users), 500);
  });
};

// Fetch a single user by ID
export const getUser  = (userId) =>
  fetch(`${API_URL}/users/${userId}`).then((res) => res.json());

export const addUser = (user) =>
  fetch(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());


export const getProducts = () => fetch(`${API_URL}/products`).then((res) => res.json());
export const addProduct = (product) =>
  fetch(`${API_URL}/products`, {
    method: 'POST',
    body: JSON.stringify(product),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());

  export const updateProduct = (product) => 
    fetch(`${API_URL}/products`, {
      method: 'POST',  
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());

    export const login = (email, password) =>
      fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Invalid login credentials'); // Handle errors gracefully
        }
        return res.json();
      });
    

  export const register = (username, email, password) =>
    fetch(`http://localhost:5000/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to register'); // Handle bad responses
      }
      return res.json();
    });


    export const forgotPassword = (email) =>
      fetch(`http://localhost:5000/api/auth/forgot-password`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json());
    
    export const resetPassword = (token, newPassword) =>
      fetch(`http://localhost:5000/api/auth/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json());
    