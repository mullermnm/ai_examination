import Controller from './Controller.js';
import ExamRepo from '../interface/exam.js';
import ExamService from '../services/exam.js';
import examSchema from '../validators/Joi/schemas/exam.js';

const _service = new ExamService(ExamRepo);

class ExamController extends Controller {
    constructor(service) {
        super(service);
    }

    async create(req, res) {
        console.info('controller', req.body);
        // Add the user ID to the exam data
        req.body.registeredBy = req.user.id;        
        // Create the exam
        const response = await _service.create(req.body);
        return res.status(response.statusCode).send(response);
    }

    async list(req, res) {
        try {
            // Set headers to prevent caching
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.set('Expires', '-1');
            res.set('Pragma', 'no-cache');
            
            const response = await _service.list(req.user.id);
            console.log('Exams list response:', response); // Debug log
            return res.status(response.statusCode).send(response);
        } catch (error) {
            console.error('Error in list controller:', error); // Debug log
            return res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            console.info('exam id', req.params.id);
            console.info(req.user)
            console.info('user id', req.user.id);
            const response = await _service.getById(req.params.id, req.user.id);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            console.error('Error in getById controller:', error);
            return res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            console.info('exam id', req.params.id);
            const response = await _service.update(req.params.id, req.body, req.user.id);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            console.error('Error in update controller:', error);
            return res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const response = await _service.delete(req.params.id, req.user.id);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async updateStatus(req, res) {
        const response = await _service.updateStatus(req.params.id, req.body.status, req.user.id);
        return res.status(response.statusCode).send(response);
    }

    async getPublishedExams(req, res) {
        try {
            const response = await _service.getPublishedExams();
            return res.status(response.statusCode).send(response);
        } catch (error) {
            console.error('Error in getPublishedExams controller:', error);
            return res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }
}

export default new ExamController(_service);