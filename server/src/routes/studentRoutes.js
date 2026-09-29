import express from 'express';
import {
  getStudents,
  getStudentStats,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { createStudentValidator, updateStudentValidator } from '../validators/studentValidators.js';
import { validate } from '../middleware/validateMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All student routes require authentication
router.use(protect);

router.get('/stats', getStudentStats);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudentValidator, validate, createStudent);
router.put('/:id', updateStudentValidator, validate, updateStudent);
router.delete('/:id', deleteStudent);

export default router;
