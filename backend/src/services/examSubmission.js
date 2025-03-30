import Service from './Service.js';
import { ObjectId } from 'mongodb';

class ExamSubmissionService extends Service {
    constructor(repo) {
        super(repo);
    }

    async submit(data) {
        try {
            const submissionData = {
                examId: ObjectId(data.examId),
                studentId: data.studentId,
                answers: data.answers,
                submittedAt: new Date(),
                status: 'SUBMITTED',
                score: 0
            };

            const response = await this.repo.insert(submissionData);
            return this.successResponse(response);
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }

    async getMySubmissions(studentId) {
        try {
            const query = { studentId: ObjectId(studentId) };
            const response = await this.repo.getAll(query);
            return this.successResponse(response);
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }

    async getSubmissionsByExam(examId) {
        try {
            const query = { examId: ObjectId(examId) };
            const response = await this.repo.getAll(query);
            return this.successResponse(response);
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }

    async getSubmissionById(submissionId) {
        try {
            const submission = await this.repo.getById(submissionId);
            
            if (!submission.item) {
                return this.errorResponse('Submission not found', 404);
            }

            return this.successResponse(submission);
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }

    async gradeSubmission(submissionId, data) {
        try {
            const submission = await this.repo.getById(submissionId);
            
            if (!submission.item) {
                return this.errorResponse('Submission not found', 404);
            }

            const updateData = {
                score: data.score,
                feedback: data.feedback,
                gradedAt: new Date(),
                status: 'GRADED'
            };

            const response = await this.repo.update(submissionId, updateData);
            return this.successResponse(response);
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }
}

export default ExamSubmissionService;
