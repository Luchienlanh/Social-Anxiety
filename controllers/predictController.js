const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { demographicStore } = require('./demographicController');
const { lifestyleStore } = require('./lifestyleController');
const { mentalIndicatorStore } = require('./mentalIndicatorController');
const { mentalHistoryStore } = require('./mentalHistoryController');

const PROJECT_ROOT = path.join(__dirname, '..');
const SAVED_MODELS_DIR = path.join(PROJECT_ROOT, 'saved_models');
const PYTHON_BIN = process.env.PYTHON_BIN || process.env.PYTHON || 'python';

const readJsonIfExists = (filename) => {
    const filePath = path.join(SAVED_MODELS_DIR, filename);
    if (!fs.existsSync(filePath)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const getAvailableModels = (req, res) => {
    try {
        const modelRegistry = readJsonIfExists('model_registry.json');
        const featureEngineeringRegistry = readJsonIfExists('feature_engineering_registry.json');
        const metadata = readJsonIfExists('experiment_metadata.json');

        if (!modelRegistry) {
            return res.status(404).json({
                success: false,
                message: 'Model registry not found. Please rerun CS114_FinalModel.ipynb to train and save models.',
                missing: ['saved_models/model_registry.json']
            });
        }

        return res.status(200).json({
            success: true,
            models: modelRegistry.models || [],
            best_model: modelRegistry.best_model,
            final_model: modelRegistry.final_model,
            feature_engineering_models: featureEngineeringRegistry?.models || [],
            best_feature_engineering: featureEngineeringRegistry?.best_feature_engineering,
            metadata
        });
    } catch (error) {
        console.error('Error fetching models:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch available models',
            error: error.message
        });
    }
};

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null);

const buildInputFromSections = ({ demographic = {}, lifestyle = {}, mentalIndicator = {}, mentalHistory = {}, body = {} }) => ({
    model_name: firstDefined(body.model_name, body.modelName),

    age: firstDefined(demographic.age, body.age),
    gender: firstDefined(demographic.gender, body.gender),
    occupation: firstDefined(demographic.occupation, demographic.occurpation, body.occupation, body.occurpation),

    sleepHours: firstDefined(lifestyle.sleepHours, body.sleepHours),
    physicalActivity: firstDefined(lifestyle.physicalActivity, body.physicalActivity),
    caffeineIntake: firstDefined(lifestyle.caffeineIntake, body.caffeineIntake),
    alcoholConsumption: firstDefined(lifestyle.alcoholConsumption, lifestyle.alcoholUse, body.alcoholConsumption, body.alcoholUse),
    smoking: firstDefined(lifestyle.smoking, lifestyle.smokingHabbits, body.smoking, body.smokingHabbits),
    dietQuality: firstDefined(lifestyle.dietQuality, body.dietQuality),
    recentMajorLifeEvent: firstDefined(lifestyle.recentMajorLifeEvent, lifestyle.majorEvent, body.recentMajorLifeEvent, body.majorEvent),

    stressLevel: firstDefined(mentalIndicator.stressLevel, body.stressLevel),
    heartRate: firstDefined(mentalIndicator.heartRate, body.heartRate),
    breathingRate: firstDefined(mentalIndicator.breathingRate, body.breathingRate),
    sweatingLevel: firstDefined(mentalIndicator.sweatingLevel, body.sweatingLevel),
    dizziness: firstDefined(mentalIndicator.dizziness, mentalIndicator.dizzinessLevel, body.dizziness, body.dizzinessLevel),

    familyHistoryOfAnxiety: firstDefined(mentalHistory.familyHistoryOfAnxiety, mentalHistory.familyHist, body.familyHistoryOfAnxiety, body.familyHist),
    medication: firstDefined(mentalHistory.medication, mentalHistory.useMedication, body.medication, body.useMedication),
    therapySessions: firstDefined(mentalHistory.therapySessions, mentalHistory.therapySession, body.therapySessions, body.therapySession)
});

const buildPredictionInput = (req) => {
    const sessionId = req.headers['x-session-id'];
    const body = req.body || {};

    const hasSectionPayload = body.demographic || body.lifestyle || body.mentalIndicator || body.mentalHistory;
    if (hasSectionPayload) {
        return {
            input: buildInputFromSections({
                demographic: body.demographic,
                lifestyle: body.lifestyle,
                mentalIndicator: body.mentalIndicator,
                mentalHistory: body.mentalHistory,
                body
            }),
            missingSections: []
        };
    }

    if (!sessionId) {
        return {
            input: buildInputFromSections({ body }),
            missingSections: []
        };
    }

    const demographic = demographicStore.get(sessionId);
    const lifestyle = lifestyleStore.get(sessionId);
    const mentalIndicator = mentalIndicatorStore.get(sessionId);
    const mentalHistory = mentalHistoryStore.get(sessionId);

    const missingSections = [];
    if (!demographic) missingSections.push('demographic');
    if (!lifestyle) missingSections.push('lifestyle');
    if (!mentalIndicator) missingSections.push('mentalIndicator');
    if (!mentalHistory) missingSections.push('mentalHistory');

    return {
        input: buildInputFromSections({
            demographic,
            lifestyle,
            mentalIndicator,
            mentalHistory,
            body
        }),
        missingSections
    };
};

const runPythonPredict = (inputData) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(PROJECT_ROOT, 'predict.py');
        if (!fs.existsSync(scriptPath)) {
            reject(new Error('predict.py not found'));
            return;
        }

        const pythonProcess = spawn(PYTHON_BIN, [scriptPath], {
            cwd: PROJECT_ROOT,
            env: {
                ...process.env,
                PYTHONIOENCODING: 'utf-8'
            }
        });

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString('utf-8');
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString('utf-8');
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python exited with code ${code}: ${stderr || stdout}`));
                return;
            }

            try {
                resolve(JSON.parse(stdout.trim()));
            } catch (error) {
                reject(new Error(`Failed to parse Python output: ${stdout || stderr}`));
            }
        });

        pythonProcess.on('error', (error) => {
            reject(new Error(`Failed to start Python: ${error.message}`));
        });

        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();
    });
};

const statusFromPredictionError = (code) => {
    switch (code) {
        case 'VALIDATION_ERROR':
            return 400;
        case 'MODEL_NOT_FOUND':
            return 404;
        case 'MODEL_ARTIFACT_NOT_FOUND':
        case 'REGISTRY_NOT_FOUND':
            return 503;
        default:
            return 500;
    }
};

const hasPredictionBody = (body = {}) => {
    const ignoredKeys = new Set(['model_name', 'modelName']);
    return Object.keys(body).some((key) => !ignoredKeys.has(key));
};

const predictAnxiety = async (req, res) => {
    try {
        const { input, missingSections } = buildPredictionInput(req);

        if (missingSections.length > 0 && !hasPredictionBody(req.body)) {
            return res.status(400).json({
                success: false,
                message: `Missing data sections: ${missingSections.join(', ')}. Please submit all 4 sections first or send a complete prediction payload.`,
                missing: missingSections
            });
        }

        const result = await runPythonPredict(input);

        if (!result.success) {
            return res.status(statusFromPredictionError(result.error?.code)).json({
                success: false,
                message: result.error?.message || 'Prediction failed',
                error: result.error,
                missing: result.error?.missing
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                predicted_score: result.prediction.score,
                raw_score: result.prediction.raw_score,
                rounded_level: result.prediction.rounded_level,
                anxiety_level: result.prediction.label,
                model_used: result.model_used,
                model_file: result.model_file,
                feature_engineering: result.feature_engineering,
                input,
                preprocessed_input: result.preprocessed_input
            }
        });
    } catch (error) {
        console.error('Predict error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = { predictAnxiety, getAvailableModels };
