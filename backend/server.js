const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const usageRoutes = require('./routes/usageRoute');
const Usage=require('./models/Usage');

const Product = require('./models/Product');

require('dotenv').config();
const app = express();
 
 
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', usageRoutes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api', usageRoutes);
 
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

    
 
    // Simulate a token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });
   
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
 
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token
 
  if (!token) {
    return res.status(401).json({ message: 'No token provided' }); // Unauthorized if no token
  }
 
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Invalid or expired token' }); // Forbidden if token invalid
    }
 
    req.user = user; // Attach user data to the request object
    next(); // Proceed to next middleware or route handler
  });
};
 
 
// Example Express route for fetching user data
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware to authenticate and set req.user
    const user = await User.findById(userId);
    console.log('Fetching user for ID:', userId);
console.log('Database user:', user);
 
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }
    res.json({
      name: user.username,
      email: user.email,
      monthlyData: user.monthlyData, // Adjust according to your user schema
      dailyData: user.dailyData,
      yearlyData: user.yearlyData,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
 
//calculatinguse screen time based on the use of website
async function trackUsage(userId, sessionDuration) {
  try {
    const sessionDurationInHours = sessionDuration / 60; // Convert minutes to hours

    console.log("Tracking usage for user:", userId, "Session Duration:", sessionDuration);

    let usageData = await Usage.findOne({ userId });

    const now = new Date();
    const today = now.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];

    if (!usageData) {
      // If no usage data exists for the user, create a new record
      usageData = new Usage({
        userId,
        daily: sessionDurationInHours,
        monthly: sessionDurationInHours,
        yearly: sessionDurationInHours,
        lastUpdated: now,
      });

      await usageData.save();
      console.log("New usage data created for user:", userId);
    } else {
      // Check if date has changed and reset daily, monthly, and yearly usage accordingly
      const lastUpdatedDate = usageData.lastUpdated.toISOString().split("T")[0];

      const isNewDay = lastUpdatedDate !== today;
      const isNewMonth = lastUpdatedDate < firstDayOfMonth;
      const isNewYear = lastUpdatedDate < firstDayOfYear;

      const updatedDaily = isNewDay ? sessionDurationInHours : usageData.daily + sessionDurationInHours;
      const updatedMonthly = isNewMonth ? sessionDurationInHours : usageData.monthly + sessionDurationInHours;
      const updatedYearly = isNewYear ? sessionDurationInHours : usageData.yearly + sessionDurationInHours;

      await Usage.findOneAndUpdate(
        { userId },
        {
          $set: {
            daily: updatedDaily,
            monthly: updatedMonthly,
            yearly: updatedYearly,
            lastUpdated: now,
          },
        },
        { new: true }
      );

      console.log("Usage data updated for user:", userId);
    }
  } catch (error) {
    console.error("Error tracking usage:", error);
  }
}

// Endpoint to track usage
app.post("/api/track-usage", async (req, res) => {
  const { userId, sessionDuration } = req.body;

  if (!userId || !sessionDuration || sessionDuration <= 0) {
    return res.status(400).json({ message: "Invalid user ID or session duration" });
  }

  await trackUsage(userId, sessionDuration);
  res.status(200).json({ message: "Usage data updated successfully" });
});

//  Endpoint to get usage data for a user
app.get("/api/usage", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const usageData = await Usage.findOne({ userId });

    if (!usageData) {
      return res.status(404).json({ message: "No usage data found for this user" });
    }
    //const monthlyUsage = usageData.monthly; 
    res.status(200).json({
      daily: usageData.daily.toFixed(5),
      monthly: usageData.monthly.toFixed(5),
      yearly: usageData.yearly.toFixed(5),
    });
  } catch (error) {
    console.error("Error fetching usage data:", error);
    res.status(500).json({ message: "Server error" });
  }
});


//adding products
app.post('/api/products', async (req, res) => {
  const { name, price, category, stock } = req.body;

  // Validate input
  if (!name || !price || !category || stock === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

  try {
    const newProduct = new Product({ name, price, category, stock ,userId});
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', data: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

app.get('/api/products', async (req, res) => {
  try {
      const products = await Product.find({ userId: { $exists: true } });  // Assuming Mongoose
      res.json(products);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});


// Update Product (Edit Product)
app.put("/api/products/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { name, price, category, stock } = req.body;

      // Find the product by ID and update
      const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { name, price, category, stock },
          { new: true, runValidators: true } // Return updated document
      );

      if (!updatedProduct) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(updatedProduct);
  } catch (error) {
      res.status(500).json({ message: "Error updating product", error: error.message });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; 

    // Find the product by ID
    const product = await Product.findById(id);
    console.log("Fetched Product:", product); // Debugging log

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure product.userId exists before calling toString()
    if (!product.userId) {
      return res.status(500).json({ message: "Product data error: userId missing" });
    }

    if (product.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: Not authorized to delete this product" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
});

// Define the /api/TodoPlanner route
app.get('/api/todoplanner', (req, res) => {
    console.log('Request received for /api/todoplanner');
    res.json({ message: 'Here is your todo planner data' });
});

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  status: { type: String, default: 'not viewed' },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', TaskSchema);
// API route to get tasks from DB
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();  // Fetch tasks from DB
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});


// POST /tasks - Adding a new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      status: req.body.status,
      completed: req.body.completed,
    });
    await newTask.save();
    res.status(201).json(newTask);  // Respond with the added task
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(400).json({ message: 'Error adding task', error: error.message });
  }
});

// Authentication route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is the specific one with 'info@6seasonsorganic.com'
    if (email === 'info@6seasonsorganic.com') {
      const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
      return res.json({ token, access: 'granted' });
    } else {
      return res.json({ access: 'denied' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});




 // Assuming Product model is defined

app.get('/api/products/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search products by name
    const results = await Product.find({ name: { $regex: query, $options: 'i' } });

    res.json(results);
  } catch (error) {
    console.error('Error in search endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 