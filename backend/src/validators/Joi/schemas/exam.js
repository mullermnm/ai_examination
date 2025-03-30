const Joi = require('joi');

const questionSchema = Joi.object({
    text: Joi.string()
        .required()
        .messages({
            'string.empty': 'Question text cannot be empty',
            'any.required': 'Question text is required'
        }),
    type: Joi.string()
        .valid('multiple-choice', 'true-false', 'short-answer')
        .required()
        .messages({
            'any.only': 'Question type must be one of: multiple-choice, true-false, or short-answer',
            'any.required': 'Question type is required'
        }),
    options: Joi.when('type', {
        is: 'multiple-choice',
        then: Joi.array().items(Joi.string()).min(2).required()
            .messages({
                'array.min': 'Multiple choice questions must have at least 2 options',
                'array.base': 'Options must be an array',
                'any.required': 'Options are required for multiple choice questions'
            }),
        otherwise: Joi.optional()
    }),
    correctAnswer: Joi.when('type', {
        is: 'multiple-choice',
        then: Joi.number().required()
            .messages({
                'number.base': 'Correct answer must be a number for multiple choice questions',
                'any.required': 'Correct answer is required for multiple choice questions'
            }),
        is: 'true-false',
        then: Joi.boolean().required()
            .messages({
                'boolean.base': 'Correct answer must be true or false',
                'any.required': 'Correct answer is required for true/false questions'
            }),
        otherwise: Joi.string().required()
            .messages({
                'string.empty': 'Model answer cannot be empty',
                'any.required': 'Model answer is required for short answer questions'
            })
    }),
    weight: Joi.number()
        .required()
        .messages({
            'number.base': 'Weight must be a number',
            'any.required': 'Question weight is required'
        }),
    number: Joi.number()
        .required()
        .messages({
            'number.base': 'Question number must be a number',
            'any.required': 'Question number is required'
        })
});

const examInfoSchema = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            'string.empty': 'Exam title cannot be empty',
            'any.required': 'Exam title is required'
        }),
    description: Joi.string()
        .required()
        .messages({
            'string.empty': 'Exam description cannot be empty',
            'any.required': 'Exam description is required'
        }),
    courseName: Joi.string()
        .required()
        .messages({
            'string.empty': 'Course name cannot be empty',
            'any.required': 'Course name is required'
        }),
    courseCode: Joi.string()
        .required()
        .messages({
            'string.empty': 'Course code cannot be empty',
            'any.required': 'Course code is required'
        }),
    examCode: Joi.string()
        .required()
        .messages({
            'string.empty': 'Exam code cannot be empty',
            'any.required': 'Exam code is required'
        }),
    totalMarks: Joi.number()
        .required()
        .messages({
            'number.base': 'Total marks must be a number',
            'any.required': 'Total marks is required'
        }),
    timeLimit: Joi.number()
        .required()
        .messages({
            'number.base': 'Time limit must be a number',
            'any.required': 'Time limit is required'
        })
});

const create = Joi.object({
    examInfo: examInfoSchema.required(),
    questions: Joi.array()
        .items(questionSchema)
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one question is required',
            'array.base': 'Questions must be an array',
            'any.required': 'Questions are required'
        })
});

const update = Joi.object({
    examInfo: examInfoSchema.required(),
    questions: Joi.array()
        .items(questionSchema)
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one question is required',
            'array.base': 'Questions must be an array'
        })
});

const updateStatus = Joi.object({
    status: Joi.string()
        .valid('DRAFT', 'PUBLISHED', 'ARCHIVED')
        .required()
        .messages({
            'any.only': 'Status must be one of: DRAFT, PUBLISHED, or ARCHIVED',
            'any.required': 'Status is required'
        })
});

module.exports = {
    create: create,
    update: update,
    updateStatus
};
