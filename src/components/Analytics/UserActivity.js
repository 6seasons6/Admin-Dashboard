import React, { useEffect, useState } from 'react';

const UserActivity = () => {
  const [userActivity, setUserActivity] = useState([]);

  useEffect(() => {
    // Fetch user activity data from API
  }, []);

  return (
    <div>
      <h2>User Activity</h2>
      {/* Render activity data */}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userActivity.map((activity, index) => (
            <tr key={index}>
              <td>{activity.username}</td>
              <td>{activity.lastLogin}</td>
              <td>{activity.actions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivity;
