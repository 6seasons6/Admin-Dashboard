import React, { useState } from "react";
import { TextField, Button, Box, Avatar, Typography } from "@mui/material";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Updated:", userData);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 ,backgroundColor:"#decaca;"}}>
      <Typography variant="h5" textAlign="center" mb={2}>Edit Profile</Typography>
      <Box textAlign="center">
        <Avatar sx={{ width: 80, height: 80, mb: 2 }} />
        <Button variant="outlined" size="small">Change Photo</Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label=" Name" name="name" value={userData.name} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Email" name="email" value={userData.email} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Phone Number" name="phone" value={userData.phone} onChange={handleChange} />        
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Save Changes</Button>
      </form>
    </Box>
  );
};

export default Profile;
