const jwt = require('jsonwebtoken');
const env = require('../config/env.config');
const RefreshToken = require('../models/RefreshToken.model');

const generateTokens = async (userId) => {
  try {
    const accessToken = jwt.sign(
      { _id: userId },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { _id: userId },
      env.jwtRefreshSecret,
      { expiresIn: env.jwtRefreshExpiresIn }
    );

    // Save refresh token to DB
    const decodedRefresh = jwt.verify(refreshToken, env.jwtRefreshSecret);
    await RefreshToken.create({
      token: refreshToken,
      user: userId,
      expiresAt: new Date(decodedRefresh.exp * 1000)
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error('Error generating tokens');
  }
};

module.exports = { generateTokens };
