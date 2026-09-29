import { User } from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('A user with this email address already exists', 409, [
      { field: 'email', message: 'Email address is already registered' },
    ]);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  return sendSuccess(
    res,
    201,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    },
    'User registered successfully'
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return sendError(res, 401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  return sendSuccess(
    res,
    200,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    },
    'Logged in successfully'
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  return sendSuccess(
    res,
    200,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    },
    'Current user profile retrieved successfully'
  );
});
