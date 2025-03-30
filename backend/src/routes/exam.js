import express from 'express';
import examController from '../controller/exam.js';
import { studentAuth, teacherAuth, auth } from '../middleware/auth/user_auth.js';
import valMiddleware from '../validators/Joi/middleware.js';
import ExamSchema from '../validators/Joi/schemas/exam.js';

const router = express.Router();

router.post('/create', 
    teacherAuth(), 
    valMiddleware(ExamSchema.create), 
    examController.create
);

router.get('/list', 
    teacherAuth(), 
    examController.list
);

// Move published route before /:id to avoid conflicts
router.get('/published',
    studentAuth(),  
    examController.getPublishedExams
);

router.get('/:id',
    auth(),
    examController.getById
);

router.put('/:id',
    teacherAuth(),
    valMiddleware(ExamSchema.update),
    examController.update
);

router.patch('/:id/status',
    teacherAuth(),
    valMiddleware(ExamSchema.updateStatus),
    examController.updateStatus
);

router.delete('/delete/:id', 
    teacherAuth(),
    examController.delete
);

export default router;