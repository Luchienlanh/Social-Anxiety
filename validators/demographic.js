const Joi = require('joi');

const createDemographicSchema = Joi.object({
    age: Joi.number()
        .required()
        .min(1)
        .max(120)
        .messages({
            'any.required': 'Age is reuqired',
            'number.base': 'Age must be a number',
            'number.min': 'Age must be at least 1',
            'number.max': 'Age must be at most 120',
        }),
    gender: Joi.string()
        .required()
        .valid('Male', 'Female', 'Other')
        .messages({
            'string.valid': 'Gender must be either Male, Female, or Other'
        }),
    occurpation: Joi.string()
        .required()
        .messages({
            'any.required': 'Occurpation is required'
        }),
})

const updateDemographicSchema = Joi.object({
    age: Joi.number().optional()
        .min(1)
        .max(120)
        .messages({
            'number.base': 'Age must be a number',
            'number.min': 'Age must be at least 1',
            'number.max': 'Age must be at most 120',
        }),
    gender: Joi.string().optional()
        .valid('Male', 'Female', 'Other')
        .messages({
            'string.valid': 'Gender must be either Male, Female, or Other'
        }),
    occurpation: Joi.string().optional()
        .messages({
            'string.base': 'Occurpation must be a string'
        })
})

module.exports = { createDemographicSchema, updateDemographicSchema };