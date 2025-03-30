import express from 'express';
import examSubmissionsController from '../controller/examSubmissions.js';
import { studentAuth, teacherAuth } from '../middleware/auth/user_auth.js';
import valMiddleware from '../validators/Joi/middleware.js';
import ExamSubmissionSchema from '../validators/Joi/schemas/examSubmissions.js';

const router = express.Router();

// Student routes
router.post('/submit', 
    studentAuth(), 
    valMiddleware(ExamSubmissionSchema.submit), 
    examSubmissionsController.submit
);

router.get('/my-submissions', 
    studentAuth(), 
    examSubmissionsController.getMySubmissions
);

// Teacher routes
router.get('/exam/:examId', 
    teacherAuth(), 
    examSubmissionsController.getSubmissionsByExam
);

router.get('/:submissionId', 
    teacherAuth(), 
    examSubmissionsController.getSubmissionById
);

router.patch('/:submissionId/grade',
    teacherAuth(),
    valMiddleware(ExamSubmissionSchema.grade),
    examSubmissionsController.gradeSubmission
);

export default router;