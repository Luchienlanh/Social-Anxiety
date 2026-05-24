const Joi = require('joi');

const createMentalHistorySchema = Joi.object({
    familyHist: Joi.boolean()
        .required()
        .messages({
            'any.required': 'Family history is required',
            'boolean.base': 'Family history must be a boolean',
        }),
    useMedication: Joi.boolean()
        .required()
        .messages({
            'any.required': 'Use medication is required',
            'boolean.base': 'Use medication must be a boolean',
        }),
    therapySession: Joi.number()
        .required()
        .integer()
        .messages({
            'any.required': 'Therapy session is required',
            'number.base': 'Therapy session must be a number',
        })
})

const updateMentalHistorySchema = Joi.object({
    familyHist: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Family history must be a boolean',
        }),
    useMedication: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Use medication must be a boolean',
        }),
    therapySession: Joi.number()
        .optional()
        .integer()
        .messages({
            'number.base': 'Therapy session must be a number',
        })
})

module.exports = { createMentalHistorySchema, updateMentalHistorySchema };