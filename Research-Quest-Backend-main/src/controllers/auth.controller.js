const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user.model');

// Helper to generate access and refresh tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, fullName: user.fullName, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // 15 minutes access token
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // 7 days refresh token
  );

  // Save the refresh token to database
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
};

// Helper to set the refresh token cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Lax matches cross-site cookie settings for dev environments
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
  });
};

// POST - Register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, institution, researchDomain } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // First user registered can be admin for demonstration purposes
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      institution: institution || '',
      researchDomain: researchDomain || '',
      role,
      refreshTokens: [],
    });

    await user.save();

    const { accessToken, refreshToken } = await generateTokens(user);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      message: 'Account created successfully',
      token: accessToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        institution: user.institution,
        researchDomain: user.researchDomain,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

// POST - Login
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(401).json({
        error: 'This account uses Google Sign-In. Please sign in with Google.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      message: 'Login successful',
      token: accessToken,
      rememberMe: !!rememberMe,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'user',
        institution: user.institution,
        researchDomain: user.researchDomain,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

// POST - Refresh Token
exports.refresh = async (req, res) => {
  try {
    // Read from cookie (primary) or request body (fallback)
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ error: 'Invalid refresh token session' });
    }

    // Token Rotation: Remove the used refresh token and generate a new pair
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user);
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      token: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Server error during token refresh' });
  }
};

// POST - Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If this email is registered, you will receive a password reset link.' });
    }

    if (!user.password) {
      return res.json({ message: 'If this email is registered, you will receive a password reset link.' });
    }

    const resetToken = jwt.sign(
      { id: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);

    res.json({ message: 'If this email is registered, you will receive a password reset link.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

// POST - Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;

    if (!token || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(decoded.id, { 
      password: hashedPassword,
      refreshTokens: [] // Revoke all sessions on password change for security
    });

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired reset token' });
  }
};

// GET - Google OAuth
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// GET - Google OAuth Callback
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
    }

    try {
      const { accessToken, refreshToken } = await generateTokens(user);
      setRefreshTokenCookie(res, refreshToken);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/dashboard?token=${accessToken}`);
    } catch (error) {
      console.error('Google callback token generation error:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
    }
  })(req, res, next);
};

// GET - Current User (verify token)
exports.getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'user',
        institution: user.institution,
        researchDomain: user.researchDomain,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// POST / GET - Logout
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (token) {
      // Find the user with this refresh token and delete it
      await User.updateOne(
        { refreshTokens: token },
        { $pull: { refreshTokens: token } }
      );
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout properly' });
  }
};
