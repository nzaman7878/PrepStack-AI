const User = require('../models/User.model');
const RefreshToken = require('../models/RefreshToken.model');
const { generateTokens } = require('../utils/tokenUtils');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const env = require('../config/env.config');

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with email already exists');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const userRes = user.toJSON();

  res
    .status(201)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(201, { user: userRes, accessToken }, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: user.toJSON(), accessToken }, 'User logged in successfully'));
});

const logout = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (incomingRefreshToken) {
    await RefreshToken.findOneAndDelete({ token: incomingRefreshToken });
  }

  res
    .status(200)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, null, 'User logged out successfully'));
});

const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, env.jwtRefreshSecret);
    const tokenRecord = await RefreshToken.findOne({ token: incomingRefreshToken });
    
    if (!tokenRecord) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    // Rotate token
    await RefreshToken.findByIdAndDelete(tokenRecord._id);

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

    res
      .status(200)
      .cookie('refreshToken', newRefreshToken, cookieOptions)
      .json(new ApiResponse(200, { accessToken }, 'Access token refreshed'));

  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(new ApiResponse(200, { user: user.toJSON() }, 'User fetched successfully'));
});

module.exports = {
  register,
  login,
  logout,
  refresh,
  getMe
};
