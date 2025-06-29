const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment info
console.log('🚀 Starting server...');
console.log('📊 Port:', PORT);
console.log('🗄️ MongoDB URI:', process.env.MONGO_URI ? 'Set ✅' : 'Not set ❌');

// Middlewares
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] // Thay bằng domain frontend thực tế
    : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Gắn auth routes NGAY SAU middleware

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Kết nối MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/projectcourse';
mongoose.connect(mongoUri)
.then(() => console.log('✅ Connected to MongoDB successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  console.log('💡 Please check your MONGO_URI environment variable');
});

// Course Schema
const CourseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model('Course', CourseSchema, 'Course'); 

// API courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    console.log('DATA FROM DATABASE:', courses);
    res.json(courses);
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// API để tạo dữ liệu mẫu cho testing
app.post('/api/test/setup-sample-data', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Tìm user
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tạo progress data mẫu
    const sampleProgress = new Map();
    sampleProgress.set('Math', {
      completedLessons: 3,
      totalLessons: 10,
      lastAccessed: new Date()
    });
    sampleProgress.set('Physics', {
      completedLessons: 5,
      totalLessons: 10,
      lastAccessed: new Date(Date.now() - 86400000) // 1 ngày trước
    });
    sampleProgress.set('Chemistry', {
      completedLessons: 2,
      totalLessons: 10,
      lastAccessed: new Date(Date.now() - 172800000) // 2 ngày trước
    });

    // Tạo exam results mẫu
    const sampleExamResults = [
      { courseId: 'Math', score: 8.5, date: new Date() },
      { courseId: 'Physics', score: 7.0, date: new Date(Date.now() - 86400000) },
      { courseId: 'Chemistry', score: 9.0, date: new Date(Date.now() - 172800000) }
    ];

    // Cập nhật user
    user.progress = sampleProgress;
    user.examResults = sampleExamResults;
    user.coursesCompleted = ['Math', 'Physics', 'Chemistry'];
    
    await user.save();

    res.json({ 
      message: 'Sample data created successfully',
      user: {
        id: user._id,
        name: user.name,
        progress: Object.fromEntries(user.progress),
        examResults: user.examResults,
        coursesCompleted: user.coursesCompleted
      }
    });
  } catch (error) {
    console.error('Error setting up sample data:', error);
    res.status(500).json({ message: 'Error setting up sample data' });
  }
});
