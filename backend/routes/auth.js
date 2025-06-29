const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student',
  },
  coursesCompleted: [String], // Mảng các khóa học đã đăng ký
  examResults: [ // Mảng lưu kết quả bài kiểm tra
    {
      courseId: String, // tên môn học: Math, Physics, Biology,...
      score: Number,    // điểm số
      date: { type: Date, default: Date.now }, // Thêm ngày thi
    }
  ],
  progress: { // Thêm tiến độ học tập
    type: Map,
    of: {
      completedLessons: { type: Number, default: 0 },
      totalLessons: { type: Number, default: 10 },
      lastAccessed: { type: Date, default: Date.now }
    }
  },
  achievements: [{ // Thêm thành tích
    title: String,
    description: String,
    icon: String,
    unlocked: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  }],
  phone: String,
  bio: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Register API
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      coursesCompleted: [],
      examResults: [],
      progress: new Map(),
      achievements: []
    });

    await newUser.save();
    res.status(201).json({ message: 'Tạo tài khoản thành công' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// Login API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    // Kiểm tra nếu mật khẩu trong DB bị lỗi
    if (!user.password || typeof user.password !== 'string') {
      return res.status(500).json({ message: 'Mật khẩu người dùng bị lỗi trong cơ sở dữ liệu' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    // Cập nhật thời gian đăng nhập cuối
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coursesCompleted: user.coursesCompleted || [],
        examResults: user.examResults || [],
        progress: user.progress || new Map(),
        achievements: user.achievements || [],
        phone: user.phone,
        bio: user.bio,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Lỗi server khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

// API: Lấy tất cả user
router.get('/allusers', async (req, res) => {
  try {
    const users = await User.find({}, '_id name email role');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
});

// Student đăng ký khóa học
router.post('/enroll-course', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    console.log(`Enrolling user ${userId} in course ${courseId}`);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    if (user.coursesCompleted.includes(courseId)) {
      console.log(`User ${userId} already enrolled in course ${courseId}`);
      return res.status(400).json({ message: 'Đã đăng ký khóa học này' });
    }

    user.coursesCompleted.push(courseId);
    
    // Khởi tạo tiến độ cho khóa học mới
    if (!user.progress) {
      user.progress = new Map();
    }
    user.progress.set(courseId, {
      completedLessons: 0,
      totalLessons: 10,
      lastAccessed: new Date()
    });

    await user.save();
    console.log(`User ${userId} successfully enrolled in course ${courseId}. New courses:`, user.coursesCompleted);

    res.json({ message: 'Đăng ký khóa học thành công', coursesCompleted: user.coursesCompleted });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký khóa học' });
  }
});

// Submit exam API
router.post('/submit-exam', async (req, res) => {
  try {
    const { userId, courseId, score } = req.body;

    if (!userId || !courseId || score == null) {
      return res.status(400).json({ message: 'Thiếu trường bắt buộc' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Nếu chưa có examResults thì tạo
    if (!user.examResults) {
      user.examResults = [];
    }

    // Kiểm tra xem học sinh đã làm bài kiểm tra này trước đó chưa
    const existingResultIndex = user.examResults.findIndex(
      result => result.courseId === courseId
    );

    if (existingResultIndex !== -1) {
      // Nếu đã có kết quả trước đó, so sánh điểm số
      const existingScore = user.examResults[existingResultIndex].score;
      
      // Nếu điểm mới cao hơn điểm cũ, cập nhật kết quả
      if (score > existingScore) {
        user.examResults[existingResultIndex].score = score;
        user.examResults[existingResultIndex].date = new Date();
      } else {
        // Nếu điểm mới không cao hơn, giữ nguyên kết quả cũ
        return res.status(200).json({ 
          message: 'Điểm không cao hơn lần trước, giữ nguyên kết quả cũ',
          kept: true,
          oldScore: existingScore,
          newScore: score
        });
      }
    } else {
      // Nếu chưa có kết quả, thêm mới
      user.examResults.push({ courseId, score, date: new Date() });
    }

    await user.save();
    
    res.status(200).json({ 
      message: 'Kết quả bài thi đã được lưu',
      updated: existingResultIndex !== -1,
      score
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi lưu kết quả bài thi' });
  }
});

// API: Cập nhật tiến độ học tập
router.post('/update-progress', async (req, res) => {
  try {
    const { userId, courseId, completedLessons, totalLessons } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    if (!user.progress) {
      user.progress = new Map();
    }

    user.progress.set(courseId, {
      completedLessons: completedLessons || 0,
      totalLessons: totalLessons || 10,
      lastAccessed: new Date()
    });

    await user.save();

    res.json({ 
      message: 'Cập nhật tiến độ thành công',
      progress: Object.fromEntries(user.progress)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật tiến độ' });
  }
});

// API: Cập nhật thông tin cá nhân
router.put('/update-profile', async (req, res) => {
  try {
    const { userId, name, email, phone, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Cập nhật thông tin
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;

    await user.save();

    res.json({ 
      message: 'Cập nhật thông tin thành công',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
  }
});

// API: Lấy thống kê dashboard
router.get('/dashboard-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Mapping courseId sang tên khóa học
    const courseNameMap = {
      'Math': 'Toán học',
      'Physics': 'Vật lý',
      'Chemistry': 'Hóa học',
      'Biology': 'Sinh học',
      'English': 'Tiếng Anh',
      'History': 'Lịch sử',
      'Geography': 'Địa lý',
      'Literature': 'Ngữ văn',
      'Civic': 'Giáo dục công dân'
    };

    // Tính toán thống kê
    const totalCourses = user.coursesCompleted?.length || 0;
    const totalExams = user.examResults?.length || 0;
    
    let averageScore = 0;
    if (user.examResults && user.examResults.length > 0) {
      const totalScore = user.examResults.reduce((sum, exam) => sum + exam.score, 0);
      averageScore = totalScore / user.examResults.length;
    }

    let averageProgress = 0;
    if (user.progress && user.progress.size > 0) {
      const progressValues = Array.from(user.progress.values());
      const totalProgress = progressValues.reduce((sum, prog) => {
        return sum + ((prog.completedLessons / prog.totalLessons) * 100);
      }, 0);
      averageProgress = totalProgress / progressValues.length;
    }

    // Lấy bài kiểm tra gần đây
    const recentExams = user.examResults
      ?.sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5) || [];

    // Lấy khóa học gần đây
    const recentCourses = [];
    if (user.progress && user.progress.size > 0) {
      const sortedProgress = Array.from(user.progress.entries())
        .sort((a, b) => new Date(b[1].lastAccessed) - new Date(a[1].lastAccessed))
        .slice(0, 3);
      
      sortedProgress.forEach(([courseId, progress]) => {
        recentCourses.push({
          id: courseId,
          courseId: courseId,
          title: courseNameMap[courseId] || courseId,
          progress: Math.round((progress.completedLessons / progress.totalLessons) * 100),
          lastAccessed: progress.lastAccessed,
          completedLessons: progress.completedLessons,
          totalLessons: progress.totalLessons
        });
      });
    }

    console.log('Recent courses:', recentCourses);
    console.log('User progress:', user.progress ? Object.fromEntries(user.progress) : 'No progress');

    res.json({
      totalCourses,
      totalExams,
      averageScore: Math.round(averageScore * 10) / 10,
      averageProgress: Math.round(averageProgress * 10) / 10,
      recentExams,
      recentCourses,
      achievements: user.achievements || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê dashboard' });
  }
});

// API: Lấy danh sách khóa học của user
router.get('/user-courses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Mapping courseId sang tên khóa học
    const courseNameMap = {
      'Math': 'Toán học',
      'Physics': 'Vật lý',
      'Chemistry': 'Hóa học',
      'Biology': 'Sinh học',
      'English': 'Tiếng Anh',
      'History': 'Lịch sử',
      'Geography': 'Địa lý',
      'Literature': 'Ngữ văn',
      'Civic': 'Giáo dục công dân'
    };

    const courses = [];
    if (user.progress) {
      user.progress.forEach((progress, courseId) => {
        courses.push({
          id: courseId,
          courseId: courseId,
          title: courseNameMap[courseId] || courseId,
          progress: Math.round((progress.completedLessons / progress.totalLessons) * 100),
          completedLessons: progress.completedLessons,
          totalLessons: progress.totalLessons,
          lastAccessed: progress.lastAccessed
        });
      });
    }

    console.log('User courses:', courses);
    console.log('User progress map:', user.progress ? Object.fromEntries(user.progress) : 'No progress');

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khóa học' });
  }
});

// API: Lấy danh sách bài kiểm tra của user
router.get('/user-exams/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const exams = user.examResults?.map(exam => ({
      id: exam._id,
      subject: exam.courseId,
      score: exam.score,
      date: exam.date,
      status: 'completed'
    })) || [];

    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài kiểm tra' });
  }
});

// API: Admin xóa người dùng
router.delete('/delete-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Kiểm tra nếu userId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
    }
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng' });
  }
});

// Thêm dependencies
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Thêm schema cho reset token
const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Token hết hạn sau 1 giờ
  }
});

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// API quên mật khẩu
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Kiểm tra email có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      // Trả về thành công ngay cả khi email không tồn tại (bảo mật)
      return res.json({ message: 'Nếu email hợp lệ, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.' });
    }
    
    // Xóa bất kỳ token cũ nào
    await ResetToken.deleteMany({ userId: user._id });
    
    // Tạo token mới
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Lưu token vào database
    await new ResetToken({
      userId: user._id,
      token: resetToken
    }).save();
    
    // Tạo link đặt lại mật khẩu
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // Gửi email
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Course & Exam" <noreply@example.com>',
      to: user.email,
      subject: 'Đặt lại mật khẩu',
      html: `
        <h1>Yêu cầu đặt lại mật khẩu</h1>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
        <a href="${resetLink}">Đặt lại mật khẩu</a>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    
    res.json({ message: 'Nếu email hợp lệ, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server' });
  }
});

// API kiểm tra token hợp lệ
router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Kiểm tra token có tồn tại và chưa hết hạn
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    
    res.json({ message: 'Token hợp lệ' });
  } catch (error) {
    console.error('Check token error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server' });
  }
});

// API đặt lại mật khẩu
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Kiểm tra token có tồn tại và chưa hết hạn
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    
    // Lấy thông tin người dùng
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    
    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();
    
    // Xóa token sau khi đặt lại mật khẩu thành công
    await ResetToken.deleteMany({ userId: user._id });
    
    res.json({ message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server' });
  }
});

module.exports = router;
