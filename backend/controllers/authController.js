const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendOtpEmail");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role, 
      email: user.email 
    },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "7d" }
  );
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role = "customer" } = req.body;
    
    console.log('📝 User signup attempt:', { name, email, role });
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        msg: "All fields are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        msg: "Password must be at least 6 characters long" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        msg: "User with this email already exists" 
      });
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === "admin" ? "admin" : "customer"
    });

    await user.save();
    console.log('✅ User created:', user.email, 'Role:', user.role);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      msg: `${user.role === 'admin' ? 'Admin' : 'Customer'} account created successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        msg: messages.join('. ')
      });
    }

    res.status(500).json({
      success: false,
      msg: "Registration failed. Please try again."
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email);
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        msg: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        msg: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ 
        success: false,
        msg: "Invalid email or password" 
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user);
    
    console.log('✅ Login successful:', email, 'Role:', user.role);

    res.json({
      success: true,
      msg: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      msg: "Login failed. Please try again."
    });
  }
};

// @desc    Send password reset code
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        msg: "Email is required"
      });
    }

    console.log('🔍 Password reset requested for:', email);

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "No account found with this email address"
      });
    }

    // Generate OTP
    const resetCode = user.generateResetCode();
    await user.save();

    console.log('🔐 Generated OTP for', email, ':', resetCode);

    // Send email
    const emailResult = await sendOtpEmail(user.email, resetCode, user.name);

    if (emailResult.success) {
      let message = `Password reset code sent to ${user.email}`;
      
      if (emailResult.method === 'console' || emailResult.devMode) {
        message += '. Check console for development code.';
      } else {
        message += '. Please check your inbox and spam folder.';
      }

      res.json({
        success: true,
        msg: message,
        ...(emailResult.devMode && { devCode: resetCode })
      });
    } else {
      res.status(500).json({
        success: false,
        msg: "Failed to send reset code. Please try again."
      });
    }

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      msg: "Something went wrong. Please try again."
    });
  }
};

// @desc    Verify reset code
// @route   POST /api/auth/verify-code
// @access  Public
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        msg: "Email and code are required"
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });

    if (!user || !user.isResetCodeValid(code)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired verification code"
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email, resetCode: code },
      process.env.JWT_SECRET + user.password,
      { expiresIn: '15m' }
    );

    user.resetToken = resetToken;
    await user.save();

    res.json({
      success: true,
      msg: "Code verified successfully",
      resetToken
    });

  } catch (error) {
    console.error('❌ Verify code error:', error);
    res.status(500).json({
      success: false,
      msg: "Something went wrong. Please try again."
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 6 characters long"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetToken: resetToken,
      isActive: true
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid reset token"
      });
    }

    // Verify reset token
    try {
      jwt.verify(resetToken, process.env.JWT_SECRET + user.password);
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired reset token"
      });
    }

    // Update password
    user.password = newPassword;
    user.clearResetFields();
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.json({
      success: true,
      msg: "Password reset successfully. You can now login with your new password."
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      msg: "Something went wrong. Please try again."
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      msg: "Failed to get user data"
    });
  }
};
