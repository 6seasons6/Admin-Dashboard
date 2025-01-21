import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from '@mui/material';

// Dummy update and add functions (you can replace these with actual API calls)
const updateUser  = (userId, user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('User  updated:', userId, user); // Simulate update action
      resolve();
    }, 500); // Simulate delay
  });
};

const addUser  = (user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('User  added:', user); // Simulate adding a new user
      resolve();
    }, 500); // Simulate delay
  });
};

const UserForm = ({ userId, userToEdit, onSave, onCancel }) => {
  const [user, setUser ] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    if (userId && userToEdit) {
      // Prefill the form with userToEdit data when editing
      setUser ({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '', // Do not prefill password for editing
        role: userToEdit.role,
        status: userToEdit.status,
      });
    } else {
      // Reset the form for creating a new user
      setUser ({
        name: '',
        email: '',
        password: '',
        role: '',
        status: 'Active',
      });
    }
  }, [userId, userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting user data:", user); // Debugging line

    // Validate form fields
    const validationErrors = {};
    if (!user.name) validationErrors.name = 'Name is required';
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) validationErrors.email = 'Valid email is required';
    if (!user.role) validationErrors.role = 'Role is required';
    if (!userId && !user.password) validationErrors.password = 'Password is required for new users';
    if (user.password && !validatePassword(user.password)) {
      validationErrors.password = 'Password must be at least 6 characters, include an uppercase letter, a number, and a special character.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (userId) {
      await updateUser (userId, user);
    } else {
      await addUser (user);
    }
    console.log("User  saved:", user); // Debugging line
    onSave(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser ((prevUser ) => ({
      ...prevUser ,
      [name]: value,
    }));
  };

  // Password validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    return passwordRegex.test(password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          {userId ? 'Edit User' : 'Create User'}
        </Typography>

        <Grid container spacing={2}>
          {/* Name Field */}
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              name="name"
              value={user.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={user.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              inputProps={{ autoComplete: 'off' }}
            />
          </Grid>

          {/* Password Field (with restrictions) */}
          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              name="password"
              value={user.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          {/* Role Field */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={user.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
              <FormHelperText>{errors.role}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Status Field */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={user.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default UserForm;