import Joi from 'joi';

const examSubmissionSchema = Joi.object({
    studentId: Joi.string().required(),
    examId: Joi.string().required(),
    answers: Joi.array().items(
        Joi.object({
            questionId: Joi.string().required(),
            answer: Joi.string().required()
        })
    ).required(),
    submittedAt: Joi.date().required()
});

export default {
    create: examSubmissionSchema,
    update: examSubmissionSchema
};
