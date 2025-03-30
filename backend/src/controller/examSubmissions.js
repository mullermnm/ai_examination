import Controller from './Controller.js';
import ExamSubmissionRepo from '../interface/examSubmission.js';
import ExamSubmissionService from '../services/examSubmission.js';
import examSubmissionSchema from '../validators/Joi/schemas/examSubmission.js';

const _service = new ExamSubmissionService(ExamSubmissionRepo);

class ExamSubmissionsController extends Controller {
    constructor(service) {
        super(service);
    }

    
}

export default new ExamSubmissionsController(_service);