import { Student } from '../models/Student.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

/**
 * Get all students with search, filters, sorting, and pagination
 * GET /api/students?search=&course=&year=&sort=&page=&limit=
 */
export const getStudents = asyncHandler(async (req, res) => {
  const { search, course, year, sort, page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const maxLimit = parseInt(process.env.PAGINATION_MAX_LIMIT || '100', 10);
  const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const query = {};

  // Server-side debounced search (regex match on name, email, phone, course)
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { course: searchRegex },
    ];
  }

  // Exact filter by course
  if (course && course.trim() !== '' && course !== 'All') {
    query.course = course.trim();
  }

  // Exact filter by year
  if (year && year !== 'All' && !isNaN(parseInt(year, 10))) {
    query.year = parseInt(year, 10);
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // default newest first
  if (sort) {
    switch (sort) {
      case 'name_asc':
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
      case '-name':
        sortOption = { name: -1 };
        break;
      case 'newest':
      case '-createdAt':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
      case 'createdAt':
        sortOption = { createdAt: 1 };
        break;
      case 'year_asc':
        sortOption = { year: 1 };
        break;
      case 'year_desc':
        sortOption = { year: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  // Execute query & total count in parallel
  const [students, total] = await Promise.all([
    Student.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Student.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return sendSuccess(
    res,
    200,
    {
      students,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    },
    'Students retrieved successfully'
  );
});

/**
 * Get overall student statistics for dashboard
 * GET /api/students/stats
 */
export const getStudentStats = asyncHandler(async (req, res) => {
  const [totalStudents, courseStats, yearStats] = await Promise.all([
    Student.countDocuments(),
    Student.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Student.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return sendSuccess(
    res,
    200,
    {
      totalStudents,
      courseStats: courseStats.map((item) => ({ course: item._id, count: item.count })),
      yearStats: yearStats.map((item) => ({ year: item._id, count: item.count })),
    },
    'Student statistics fetched successfully'
  );
});

/**
 * Get student by ID
 * GET /api/students/:id
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('createdBy', 'name email');
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  return sendSuccess(res, 200, { student }, 'Student retrieved successfully');
});

/**
 * Create a new student
 * POST /api/students
 */
export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, course, year } = req.body;

  // Check unique email
  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    throw new AppError('A student with this email address already exists', 409, [
      { field: 'email', message: 'Student email must be unique' },
    ]);
  }

  const student = await Student.create({
    name,
    email,
    phone,
    course,
    year,
    createdBy: req.user._id,
  });

  const populatedStudent = await Student.findById(student._id).populate('createdBy', 'name email');

  return sendSuccess(res, 201, { student: populatedStudent }, 'Student created successfully');
});

/**
 * Update existing student
 * PUT /api/students/:id
 */
export const updateStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, course, year } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Check unique email if email is being changed
  if (email && email.toLowerCase() !== student.email) {
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      throw new AppError('Another student with this email address already exists', 409, [
        { field: 'email', message: 'Student email must be unique' },
      ]);
    }
  }

  if (name !== undefined) student.name = name;
  if (email !== undefined) student.email = email;
  if (phone !== undefined) student.phone = phone;
  if (course !== undefined) student.course = course;
  if (year !== undefined) student.year = year;

  await student.save();
  const updatedStudent = await Student.findById(student._id).populate('createdBy', 'name email');

  return sendSuccess(res, 200, { student: updatedStudent }, 'Student updated successfully');
});

/**
 * Delete student
 * DELETE /api/students/:id
 */
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  await Student.findByIdAndDelete(req.params.id);
  return sendSuccess(res, 200, null, 'Student deleted successfully');
});
