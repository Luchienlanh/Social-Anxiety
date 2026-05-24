const { createMentalHistorySchema, updateMentalHistorySchema } = require("../validators/metalHistory");

const mentalHistoryStore = new Map();

const createMentalHistory = async (req, res) => {
    try {
        const { value, error } = createMentalHistorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sessionId = req.headers['x-session-id'] || Date.now().toString();
        mentalHistoryStore.set(sessionId, value);

        return res.status(201).json({
            success: true,
            message: 'Mental history data saved',
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

const updateMentalHistory = async (req, res) => {
    try {
        const { value, error } = updateMentalHistorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sessionId = req.headers['x-session-id'];
        if (!sessionId || !mentalHistoryStore.has(sessionId)) {
            return res.status(404).json({
                success: false,
                message: 'Session not found. Please create mental history first.'
            });
        }

        const existing = mentalHistoryStore.get(sessionId);
        const updated = { ...existing, ...value };
        mentalHistoryStore.set(sessionId, updated);

        return res.status(200).json({
            success: true,
            message: 'Mental history data updated',
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

const getMentalHistory = async (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !mentalHistoryStore.has(sessionId)) {
        return res.status(404).json({ success: false, message: 'Not found' });
    }
    return res.status(200).json({
        success: true,
        data: mentalHistoryStore.get(sessionId)
    });
};

module.exports = { createMentalHistory, updateMentalHistory, getMentalHistory, mentalHistoryStore };
