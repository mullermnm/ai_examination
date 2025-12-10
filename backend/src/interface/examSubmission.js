import BaseRepo from './BaseRepo.js';
import { model } from '../models/examSubmissions.js';

class ExamSubmissionRepo extends BaseRepo {
  constructor(model) {
    super(model);
  }

  async getMySubmissions(studentId, query = {}) {
    try {
      const q = { studentId, ...query };
      return await super.getAll(q);
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error.message || 'internal server error',
      };
    }
  }

  async getSubmissionsByExam(examId, query = {}) {
    try {
      const q = { examId, ...query };
      return await super.getAll(q);
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error.message || 'internal server error',
      };
    }
  }

  // other custom methods can be added here if needed
}

export default new ExamSubmissionRepo(model);
