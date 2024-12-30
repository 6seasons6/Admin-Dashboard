const API_URL = 'http://localhost:5000/api';

export const getUsers = () => fetch(`${API_URL}/users`).then((res) => res.json());
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

export const login = (email, password) =>
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());

export const register = (name, email, password) =>
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());
