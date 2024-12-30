import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/api';
import UserTable from './UserTable';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users on component mount
    getUsers().then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <UserTable users={users} />
    </div>
  );
};

export default UserList;
