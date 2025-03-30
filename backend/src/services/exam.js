import Service from './Service.js';    
import ExamRepo from '../interface/exam.js';
import { ObjectId } from 'mongodb';

class ExamService extends Service {
    constructor(repo) {
        super(repo);
    }

    async create(data) {
        try {
            console.info('service', data);
            // Ensure the data structure is correct
            const examData = {
                ...data.examInfo,
                questions: data.questions,
                registeredBy: data.registeredBy,
                status: 'draft' // Default status for new exams
            };

            const response = await this.repo.insert(examData);
            return this.successResponse(response);
        } catch (error) {
            console.error('Service error creating exam:', error);
            return this.errorResponse(error.message, 500);
        }
    }

    async list(userId) {
        try {
            const query = { registeredBy: userId };
            const response = await this.repo.getAll(query);
            return this.successResponse(response);
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }

    async getPublishedExams() {
        try {
            const query = { status: 'PUBLISHED' };
            const response = await this.repo.getAll(query);

            // Format the response to include only necessary fields for students
            const formattedExams = response.items.map(exam => ({
                id: exam._id,
                title: exam.title,
                courseName: exam.courseName,
                duration: exam.duration,
                totalMarks: exam.totalMarks
            }));

            return this.successResponse({ items: formattedExams });
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }

    async getById(examId, userId) {
        try {
            console.log(`Fetching exam with ID: ${examId} for user ID: ${userId}`);
            const exam = await this.repo.getById(examId);
            
            if (!exam.item) {
                console.warn(`Exam with ID: ${examId} not found.`);
                return this.errorResponse('Exam not found', 404);
            }

            // if (!exam.item.registeredBy.equals(ObjectId(userId))) {
            //     console.warn(`User ID: ${userId} is not authorized to access exam ID: ${examId}. Registered by: ${exam.item.registeredBy}`);
            //     return this.errorResponse('Unauthorized access', 403);
            // }

            console.log(`Exam with ID: ${examId} successfully fetched for user ID: ${userId}`);
            return this.successResponse(exam);
        } catch (error) {
            console.error(`Error fetching exam with ID: ${examId} for user ID: ${userId}`, error);
            return this.errorResponse(error.message, 500);
        }
    }

    async update(examId, data, userId) {
        try {
            const exam = await this.repo.getById(examId);
            console.info(exam);
            if (!exam.item) {
                return this.errorResponse('Exam not found', 404);
            }

            if (!exam.item.registeredBy.equals(ObjectId(userId))) {
                console.warn(`User ID: ${userId} is not authorized to update exam ID: ${examId}. Registered by: ${exam.item.registeredBy}`);
                return this.errorResponse('Unauthorized access', 403);
            }

            const updatedExam = await this.repo.update(examId, data);
            console.info(updatedExam);
            return this.successResponse(updatedExam);
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }

    async delete(examId, userId) {
        try {
            const exam = await this.repo.getById(examId);

            if (!exam) {
                return this.errorResponse('Exam not found', 404);
            }

            if (exam.registeredBy !== userId) {
                return this.errorResponse('Unauthorized access', 403);
            }

            await this.repo.delete(examId);
            return this.successResponse(null, 204);
        } catch (error) {
            return this.errorResponse(error.message, 500);
        }
    }

    async updateStatus(examId, newStatus, userId) {
        try {
            // Convert string ID to ObjectId
            const objectId = new ObjectId(examId);
            const exam = await this.repo.getById(objectId);
            
            if (!exam || !exam.item) {
                return this.errorResponse('Exam not found', 404);
            }

            if (exam.item.registeredBy.toString() !== userId.toString()) {
                return this.errorResponse('Unauthorized access', 403);
            }

            const updatedExam = await this.repo.update(objectId, { status: newStatus });
            return this.successResponse(updatedExam);
        } catch (error) {
            if (error.name === 'CastError' || error.name === 'BSONError') {
                return this.errorResponse('Invalid exam ID', 400);
            }
            return this.errorResponse(error.message, 500);
        }
    }
}

export default ExamService;