const { createMentalIndicatorSchema, updateMentalIndicatorSchema } = require("../validators/mentalIndicator");

const mentalIndicatorStore = new Map();

const createMentalIndicator = async (req, res) => {
    try {
        const { value, error } = createMentalIndicatorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sessionId = req.headers['x-session-id'] || Date.now().toString();
        mentalIndicatorStore.set(sessionId, value);

        return res.status(201).json({
            success: true,
            message: 'Mental indicator data saved',
            data: value,
            sessionId
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const updateMentalIndicator = async (req, res) => {
    try {
        const { value, error } = updateMentalIndicatorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sessionId = req.headers['x-session-id'];
        if (!sessionId || !mentalIndicatorStore.has(sessionId)) {
            return res.status(404).json({
                success: false,
                message: 'Session not found. Please create mental indicator first.'
            });
        }

        const existing = mentalIndicatorStore.get(sessionId);
        const updated = { ...existing, ...value };
        mentalIndicatorStore.set(sessionId, updated);

        return res.status(200).json({
            success: true,
            message: 'Mental indicator data updated',
            data: updated
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const getMentalIndicator = async (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !mentalIndicatorStore.has(sessionId)) {
        return res.status(404).json({ success: false, message: 'Not found' });
    }
    return res.status(200).json({
        success: true,
        data: mentalIndicatorStore.get(sessionId)
    });
};

module.exports = { createMentalIndicator, updateMentalIndicator, getMentalIndicator, mentalIndicatorStore };
