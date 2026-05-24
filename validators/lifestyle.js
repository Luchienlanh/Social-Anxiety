const Joi = require('joi');

const createLifestyleSchema = Joi.object({
    sleepHours: Joi.number()
        .required()
        .min(0)
        .max(24)
        .messages({
            'any.required': 'Sleep hours is required',
            'number.base': 'Sleep hours must be a number',
            'number.min': 'Sleep hours must be at least 0',
            'number.max': 'Sleep hours must be at most 24',
        }),
    physicalActivity: Joi.number()
        .required()
        .min(0)
        .max(24)
        .messages({
            'any.required': 'Physical activity hours is required',
            'number.base': 'Physical activity hours must be a number',
            'number.min': 'Physical activity hours must be at least 0',
            'number.max': 'Physical activity hours must be at most 24',
        }),
    dietQuality: Joi.number()
        .required()
        .integer()
        .min(0)
        .max(10)
        .messages({
            'any.required': 'Diet quality is required',
            'number.base': 'Diet quality must be a number',
            'number.min': 'Diet quality must be at least 0',
            'number.max': 'Diet quality must be at most 10',
        }),
    alcoholUse: Joi.number()
        .required()
        .integer()
        .min(0)
        .messages({
            'any.required': 'Alcohol use is required',
            'number.base': 'Alcohol use must be a number',
            'number.min': 'Alcohol use must be at least 0',
        }),
    caffeineIntake: Joi.number()
        .required()
        .integer()
        .min(0)
        .messages({
            'any.required': 'Caffeine intake is required',
            'number.base': 'Caffeine intake must be a number',
            'number.min': 'Caffeine intake must be at least 0',
        }),
    smokingHabbits: Joi.boolean()
        .required()
        .messages({
            'any.required': 'Smoking habbits is required',
            'boolean.base': 'Smoking habbits must be a boolean',
        }),
    majorEvent: Joi.boolean()
        .required()
        .messages({
            'any.required': 'Major event is required',
            'boolean.base': 'Major event must be a boolean',
        })
})

const updateLifestyleSchema = Joi.object({
    sleepHours: Joi.number()
        .optional()
        .min(0)
        .max(24)
        .messages({
            'number.base': 'Sleep hours must be a number',
            'number.min': 'Sleep hours must be at least 0',
            'number.max': 'Sleep hours must be at most 24',
        }),
    physicalActivity: Joi.number()
        .optional()
        .min(0)
        .max(24)
        .messages({
            'number.base': 'Physical activity hours must be a number',
            'number.min': 'Physical activity hours must be at least 0',
            'number.max': 'Physical activity hours must be at most 24',
        }),
    dietQuality: Joi.number()
        .optional()
        .integer()  
        .min(0)
        .max(10)
        .messages({
            'number.base': 'Diet quality must be a number',
            'number.min': 'Diet quality must be at least 0',
            'number.max': 'Diet quality must be at most 10',
        }),
    alcoholUse: Joi.number()
        .optional()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Alcohol use must be a number',
            'number.min': 'Alcohol use must be at least 0',
        }),
    caffeineIntake: Joi.number()
        .optional() 
        .integer()
        .min(0)
        .messages({
            'number.base': 'Caffeine intake must be a number',
            'number.min': 'Caffeine intake must be at least 0',
        }),
    smokingHabbits: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Smoking habbits must be a boolean',
        }),
    majorEvent: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Major event must be a boolean',
        })  
})

module.exports = { createLifestyleSchema, updateLifestyleSchema };