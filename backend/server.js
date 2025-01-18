const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema); // Fixed naming issue

// Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  console.log('Request Body:', req.body); 
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Simulate a token (in real scenarios, use JWT or similar library)
    const token = `fake-jwt-token-${user._id}`;

    res.status(200).json({ 
      message: 'Login successful', 
      user: { id: user._id, username: user.username, email: user.email }, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Forgot Password API
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    console.log('Received email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.RESET_TOKEN_EXPIRY,
    });
   console.log(token);
    // Create a reset link
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${encodeURIComponent(token)}`;
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in ${process.env.RESET_TOKEN_EXPIRY}.</p>`,
    };

    await transporter.sendMail(mailOptions);
   console.log("mail sent success");
    res.json({ success: true, message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
  
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  console.log('Received token:', token); // Log the received token
  console.log('Received new password:', newPassword); // Log the new password

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User  not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error); // Log the error for debugging
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: 'Reset link has expired' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/reset-password', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('<h1>Error</h1><p>Token is required.</p>');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send('<h1>Error</h1><p>Invalid or expired token.</p>');
    }

    res.send(`
      <html>
        <head>
          <title>Reset Password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              max-width: 400px;
              width: 100%;
            }
            h1 {
              text-align: center;
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            input[type="password"], input[type="submit"] {
              width: 100%;
              padding: 12px;
              margin: 10px 0;
              border: 1px solid #ccc;
              border-radius: 4px;
              font-size: 16px;
            }
            input[type="submit"] {
              background-color: #4CAF50;
              color: white;
              cursor: pointer;
              font-weight: bold;
            }
            input[type="submit"]:hover {
              background-color: #45a049;
            }
            .message {
              text-align: center;
              margin: 10px 0;
              padding: 10px;
              border-radius: 5px;
              font-weight: bold;
            }
            .success {
              color: #155724;
              background-color: #d4edda;
              border: 1px solid #c3e6cb;
            }
            .error {
              color: #721c24;
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
            }
            label {
              font-weight: bold;
              color: #555;
              margin-bottom: 5px;
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Reset Your Password</h1>
            <div id="message" class="message" style="display: none;"></div>
            <form id="resetPasswordForm">
              <input type="hidden" id="token" value="${token}" />
              <label for="newPassword">New Password:</label>
              <input type="password" id="newPassword" required placeholder="Enter your new password" />
              <input type="submit" value="Reset Password" />
            </form>
          </div>
          <script>
            document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
              event.preventDefault();

              const token = document.getElementById('token').value;
              const newPassword = document.getElementById('newPassword').value;
              const messageDiv = document.getElementById('message');

              try {
                const response = await fetch('/api/auth/reset-password', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ token, newPassword }),
                });

                const data = await response.json();

                if (response.ok) {
                  messageDiv.className = 'message success';
                  messageDiv.textContent = data.message || 'Password reset successful!';
                } else {
                  messageDiv.className = 'message error';
                  messageDiv.textContent = data.message || 'Failed to reset password.';
                }
                messageDiv.style.display = 'block';
              } catch (error) {
                messageDiv.className = 'message error';
                messageDiv.textContent = 'An error occurred. Please try again later.';
                messageDiv.style.display = 'block';
              }
            });
          </script>
        </body>
      </html>
    `);
  });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
