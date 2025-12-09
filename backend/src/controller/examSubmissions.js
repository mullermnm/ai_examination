import Controller from './Controller.js';
import ExamSubmissionRepo from '../interface/examSubmission.js';
import ExamSubmissionService from '../services/examSubmission.js';
import examSubmissionSchema from '../validators/Joi/schemas/examSubmission.js';

const _service = new ExamSubmissionService(ExamSubmissionRepo);

class ExamSubmissionsController extends Controller {
    constructor(service) {
        super(service);
    }
    async submit(req, res) {
        try {
            // studentId should come from authenticated user
            const studentId = req.user && req.user.id ? req.user.id : req.body.studentId;
            const payload = { ...req.body, studentId };
            const response = await _service.submit(payload);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async getMySubmissions(req, res) {
        try {
            const studentId = req.user && req.user.id ? req.user.id : req.query.studentId;
            const response = await _service.getMySubmissions(studentId);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async getSubmissionsByExam(req, res) {
        try {
            const { examId } = req.params;
            const response = await _service.getSubmissionsByExam(examId);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async getSubmissionById(req, res) {
        try {
            const { submissionId } = req.params;
            const response = await _service.getSubmissionById(submissionId);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async gradeSubmission(req, res) {
        try {
            const { submissionId } = req.params;
            const response = await _service.gradeSubmission(submissionId, req.body);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async deleteSubmission(req, res) {
        try {
            const { submissionId } = req.params;
            const response = await _service.deleteSubmission(submissionId);
            return res.status(response.statusCode).send(response);
        } catch (error) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }
}

export default new ExamSubmissionsController(_service);