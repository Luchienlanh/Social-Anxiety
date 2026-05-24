const Joi = require('joi');

const createMentalIndicatorSchema = Joi.object({
    heartRate: Joi.number()
        .required()
        .integer()
        .min(1)
        .messages({
            'any.required': 'Heart rate is required',
            'number.base': 'Heart rate must be a number',
        }),
    breathingRate: Joi.number()
        .required()
        .min(1)
        .integer()
        .messages({
            'any.required': 'Breathing rate is required',
            'number.base': 'Breathing rate must be a number',
        }),
    stressLevel: Joi.number()
        .required()
        .integer()
        .min(1)
        .max(10)
        .messages({
            'any.required': 'Stress level is required',
            'number.base': 'Stress level must be a number',
            'number.min': 'Stress level must be at least 1',
            'number.max': 'Stress level must be at most 10',
        }),
    sweatingLevel: Joi.number()
        .required()
        .integer()
        .min(1)
        .max(5)
        .messages({
            'any.required': 'Sweating level is required',
            'number.base': 'Sweating level must be a number',
            'number.min': 'Sweating level must be at least 1',
            'number.max': 'Sweating level must be at most 5',
        }),
    dizzinessLevel: Joi.boolean()
        .required()
        .messages({
            'any.required': 'Dizziness level is required',
            'boolean.base': 'Dizziness level must be a boolean',
        })
})

const updateMentalIndicatorSchema = Joi.object({
    heartRate: Joi.number()
        .optional()
        .integer()
        .min(1)
        .messages({
            'number.base': 'Heart rate must be a number',
        }),
    breathingRate: Joi.number()
        .optional()
        .min(1)
        .integer()
        .messages({
            'number.base': 'Breathing rate must be a number',
        }),
    stressLevel: Joi.number()
        .optional()
        .integer()
        .min(1)
        .max(10)
        .messages({
            'number.base': 'Stress level must be a number',
            'number.min': 'Stress level must be at least 1',
            'number.max': 'Stress level must be at most 10',
        }),
    sweatingLevel: Joi.number()
        .optional()
        .integer()
        .min(1)
        .max(5)
        .messages({
            'number.base': 'Sweating level must be a number',
            'number.min': 'Sweating level must be at least 1',
            'number.max': 'Sweating level must be at most 5',
        }),
    dizzinessLevel: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Dizziness level must be a boolean',
        })
})

module.exports = { createMentalIndicatorSchema, updateMentalIndicatorSchema };