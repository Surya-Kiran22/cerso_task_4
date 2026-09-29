import { body } from 'express-validator';

export const createStudentValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Student name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Student email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),

  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course is required')
    .isLength({ max: 100 })
    .withMessage('Course name cannot exceed 100 characters'),

  body('year')
    .notEmpty()
    .withMessage('Academic year is required')
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be an integer between 1 and 4')
    .toInt(),
];

export const updateStudentValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Student name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Student email cannot be empty')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),

  body('course')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Course name cannot exceed 100 characters'),

  body('year')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be an integer between 1 and 4')
    .toInt(),
];
