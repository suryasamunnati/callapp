const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Load env variables at the top

const app = express();

// CORS configuration
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/api/users', userRoutes);
const PORT = process.env.PORT || 7990;

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected successfully');
  console.log('Database:', mongoose.connection.db.databaseName);

  // Seed users if not present
  const users = [
    { 
      phoneNumber: '+918423120171',
      name: 'akif',
      status: 'offline',
      lastSeen: new Date(),
      contacts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      phoneNumber: '+919739868498',
      name: 'irfat',
      status: 'offline',
      lastSeen: new Date(),
      contacts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  try {
    for (const userData of users) {
      const existingUser = await User.findOne({ phoneNumber: userData.phoneNumber });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Seeded user: ${userData.name} (${userData.phoneNumber})`);
      }
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
})
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
