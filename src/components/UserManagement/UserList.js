import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
  Box,
} from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setFilteredUsers(data);
    });
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.role.toLowerCase().includes(lowerCaseQuery) ||
        (user.status && user.status.toLowerCase().includes(lowerCaseQuery));
        const matchesRole = roleFilter ? user.role.trim() === roleFilter.trim() : true;
        const matchesStatus = statusFilter ? user.status.trim() === statusFilter.trim() : true;    
      return matchesSearch && matchesRole && matchesStatus;
    });
    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, statusFilter, users]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUserId(user.id);
      setUserToEdit(user);
    } else {
      setEditingUserId(null);
      setUserToEdit({
        name: '',
        email: '',
        role: '',
        status: '',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSave = (newUser ) => {
    if (editingUserId) {
      setUsers(users.map(user => user.id === editingUserId ? newUser  : user));
    } else {
      setUsers([...users, { ...newUser , id: users.length + 1 }]);
    }
    setModalOpen(false);
  };

  const handleNavigateToTable = () => {
    navigate('/user-table', { state: { users } });
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>

      {/* Create User Button Above Filters */}
      <Grid container justifyContent="flex-end" style={{ marginBottom: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          aria-label="Create user"
        >
          Create User
        </Button>
      </Grid>

      {/* Top Row with Filters */}
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: '16px' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            aria-label="Search users"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
            variant="outlined"
            size="small"
            fullWidth
            aria-label="Filter by role"
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User ">User </MenuItem>
            <MenuItem value="Editor">Editor</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            variant="outlined"
            size="small"
            fullWidth
            aria-label="Filter by status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card
                sx={{
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2">Email: {user.email}</Typography>
                  <Typography variant="body2">Role: {user.role}</Typography>
                  <Typography variant="body2">Status: {user.status}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenModal(user)}
                    aria-label={`Edit user ${user.name}`}
                    sx={{
                      marginTop: 1,
                      '&:hover': {
                        backgroundColor: 'secondary.dark',
                        boxShadow: 3,
                      },
                    }}
                  >
                    Edit User
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No users found</Typography>
        )}
      </Grid>

      <Grid container justifyContent="flex-end" style={{ marginTop: '16px' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleNavigateToTable}
          aria-label="View user table"
          sx={{
            '&:hover': {
              backgroundColor: 'primary.light',
              boxShadow: 3,
            },
          }}
        >
          View User Table
        </Button>
      </Grid>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editingUserId ? 'Edit User' : 'Create User'}
          </Typography>
          <UserForm
            userId={editingUserId}  // Pass userId for editing, or null for creating
            userToEdit={userToEdit}
            onSave={handleSave}       // Pass onSave to be called after successful save
            onCancel={handleCloseModal} // Pass onCancel to close modal without saving
          />
        </Box>
      </Modal>
    </div>
  );
};

export default UserList;