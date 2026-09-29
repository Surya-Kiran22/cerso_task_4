import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';

dotenv.config();

const sampleStudents = [
  { name: 'Alex Johnson', email: 'alex.j@example.com', phone: '9876543210', course: 'Computer Science', year: 3 },
  { name: 'Sophia Chen', email: 'sophia.c@example.com', phone: '9876543211', course: 'Computer Science', year: 2 },
  { name: 'Liam Smith', email: 'liam.s@example.com', phone: '9876543212', course: 'Information Technology', year: 4 },
  { name: 'Emma Davis', email: 'emma.d@example.com', phone: '9876543213', course: 'Data Science', year: 1 },
  { name: 'Noah Miller', email: 'noah.m@example.com', phone: '9876543214', course: 'Electronics & Comm', year: 2 },
  { name: 'Olivia Wilson', email: 'olivia.w@example.com', phone: '9876543215', course: 'Mechanical Eng', year: 3 },
  { name: 'Ethan Brown', email: 'ethan.b@example.com', phone: '9876543216', course: 'Civil Eng', year: 1 },
  { name: 'Ava Taylor', email: 'ava.t@example.com', phone: '9876543217', course: 'Business Admin', year: 4 },
  { name: 'Mason Anderson', email: 'mason.a@example.com', phone: '9876543218', course: 'Computer Science', year: 1 },
  { name: 'Isabella Thomas', email: 'isabella.t@example.com', phone: '9876543219', course: 'Information Technology', year: 3 },
  { name: 'Lucas Jackson', email: 'lucas.j@example.com', phone: '9876543220', course: 'Data Science', year: 2 },
  { name: 'Mia White', email: 'mia.w@example.com', phone: '9876543221', course: 'Electrical Eng', year: 4 },
  { name: 'Oliver Harris', email: 'oliver.h@example.com', phone: '9876543222', course: 'Mechanical Eng', year: 2 },
  { name: 'Amelia Martin', email: 'amelia.m@example.com', phone: '9876543223', course: 'Civil Eng', year: 3 },
  { name: 'James Thompson', email: 'james.t@example.com', phone: '9876543224', course: 'Electronics & Comm', year: 1 },
  { name: 'Harper Garcia', email: 'harper.g@example.com', phone: '9876543225', course: 'Business Admin', year: 2 },
  { name: 'Benjamin Martinez', email: 'benjamin.m@example.com', phone: '9876543226', course: 'Computer Science', year: 4 },
  { name: 'Evelyn Robinson', email: 'evelyn.r@example.com', phone: '9876543227', course: 'Information Technology', year: 1 },
  { name: 'Henry Clark', email: 'henry.c@example.com', phone: '9876543228', course: 'Data Science', year: 3 },
  { name: 'Charlotte Rodriguez', email: 'charlotte.r@example.com', phone: '9876543229', course: 'Electrical Eng', year: 2 },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    const shouldDrop = process.argv.includes('--drop');

    if (shouldDrop) {
      console.log('[Seed] Dropping existing collections...');
      await User.deleteMany({});
      await Student.deleteMany({});
    }

    // Check or create Admin user
    let admin = await User.findOne({ email: 'admin@studentms.com' });
    if (!admin) {
      console.log('[Seed] Creating default admin user (admin@studentms.com / Admin@123456)...');
      admin = await User.create({
        name: 'System Admin',
        email: 'admin@studentms.com',
        password: 'Admin@123456',
      });
    }

    // Insert student records
    let createdCount = 0;
    for (const studentData of sampleStudents) {
      const existing = await Student.findOne({ email: studentData.email });
      if (!existing) {
        await Student.create({
          ...studentData,
          createdBy: admin._id,
        });
        createdCount++;
      }
    }

    console.log(`[Seed Success] Created ${createdCount} new student records. Total students in DB: ${await Student.countDocuments()}`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
