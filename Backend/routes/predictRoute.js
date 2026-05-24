const express = require('express');
const router = express.Router();

const { createDemographic, updateDemographic, getDemographic } = require('../controllers/demographicController');
const { createLifestyle, updateLifestyle, getLifestyle } = require('../controllers/lifestyleController');
const { createMentalIndicator, updateMentalIndicator, getMentalIndicator } = require('../controllers/mentalIndicatorController');
const { createMentalHistory, updateMentalHistory, getMentalHistory } = require('../controllers/mentalHistoryController');
const { predictAnxiety, getAvailableModels } = require('../controllers/predictController');

// --- Models ---
router.get('/models', getAvailableModels);

// --- Demographic ---
router.post('/demographic', createDemographic);
router.put('/demographic', updateDemographic);
router.get('/demographic', getDemographic);

// --- Lifestyle ---
router.post('/lifestyle', createLifestyle);
router.put('/lifestyle', updateLifestyle);
router.get('/lifestyle', getLifestyle);

// --- Mental Indicator ---
router.post('/mental-indicator', createMentalIndicator);
router.put('/mental-indicator', updateMentalIndicator);
router.get('/mental-indicator', getMentalIndicator);

// --- Mental History ---
router.post('/mental-history', createMentalHistory);
router.put('/mental-history', updateMentalHistory);
router.get('/mental-history', getMentalHistory);

// --- Predict 
router.post('/predict', predictAnxiety);

module.exports = router;
