import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserForm from './UserForm';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Modal,
  Box,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UserTable = () => {
  const location = useLocation();
  const initialUsers = location.state?.users || [];

  const [users, setUsers] = useState(initialUsers);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDeleteUser  = () => {
    setUsers(users.filter((user) => user.id !== userToDelete.id)); // Remove user from state
    handleCloseDeleteDialog();
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUserId(user.id);
      setUserToEdit(user); // Pass the entire user object
    } else {
      setEditingUserId(null);
      setUserToEdit(null); // Clear the form for creating a new user
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);
  
  const handleSave = (newUser ) => {
    if (editingUserId) {
      // Update the existing user by replacing the user with matching id
      setUsers(users.map((user) => user.id === editingUserId ? { ...user, ...newUser  } : user));
    } else {
      // Add a new user if no editingUser Id is provided
      setUsers([...users, { ...newUser , id: users.length + 1 }]);
    }
    setModalOpen(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (orderBy === 'name') {
      return order === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</ TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleOpenModal(user)} 
                    sx={{ '&:hover': { backgroundColor: 'lightgray' } }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleOpenDeleteDialog(user)} 
                    sx={{ '&:hover': { backgroundColor: 'lightgray' } }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser } color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Form Modal */}
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
            userId={editingUserId} // Pass userId for editing, or null for creating
            userToEdit={userToEdit}
            onSave={handleSave} // Save the new or updated user
            onCancel={handleCloseModal} // Close the modal without saving
          />
        </Box>
      </Modal>
    </div>
  );
};

export default UserTable;