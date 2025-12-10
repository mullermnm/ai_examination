import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { model as User } from '../src/models/users';

const seedUsers = async () => {
  try {
    const users = [
      {
        fullName: 'John Doe',
        userId: 'teacher001',
        userRole: 'teacher',
        department: 'Mathematics',
        password: bcrypt.hashSync('m', 10),
      },
      {
        fullName: 'Jane Smith',
        userId: 'student001',
        userRole: 'student',
        department: 'Biology',
        password: bcrypt.hashSync('m', 10),
      }
    ];

    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
    }

    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export default seedUsers;