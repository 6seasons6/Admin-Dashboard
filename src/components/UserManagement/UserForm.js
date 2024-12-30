import React, { useState, useEffect } from 'react';
import { addUser, updateUser } from '../../services/api';

const UserForm = ({ userId, onSave }) => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    if (userId) {
      // Fetch user data to edit if userId is provided
      // Here, you should call an API to get the user details
    }
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId) {
      updateUser(userId, user).then(() => onSave());
    } else {
      addUser(user).then(() => onSave());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Name"
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
      />
      <input
        type="text"
        value={user.role}
        onChange={(e) => setUser({ ...user, role: e.target.value })}
        placeholder="Role"
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default UserForm;
