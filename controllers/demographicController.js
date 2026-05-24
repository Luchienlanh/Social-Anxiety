const { createDemographicSchema, updateDemographicSchema } = require("../validators/demographic");
const demographicStore = new Map();

const createDemographic = async (req, res) => {
    try {
        const { value, error } = createDemographicSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sessionId = req.headers['x-session-id'] || Date.now().toString();
        demographicStore.set(sessionId, value);

        return res.status(201).json({
            success: true,
            message: 'Demographic data saved',
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

const updateDemographic = async (req, res) => {
    try {
        const { value, error } = updateDemographicSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sessionId = req.headers['x-session-id'];
        if (!sessionId || !demographicStore.has(sessionId)) {
            return res.status(404).json({
                success: false,
                message: 'Session not found. Please create demographic first.'
            });
        }

        const existing = demographicStore.get(sessionId);
        const updated = { ...existing, ...value };
        demographicStore.set(sessionId, updated);

        return res.status(200).json({
            success: true,
            message: 'Demographic data updated',
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

const getDemographic = async (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !demographicStore.has(sessionId)) {
        return res.status(404).json({ success: false, message: 'Not found' });
    }
    return res.status(200).json({
        success: true,
        data: demographicStore.get(sessionId)
    });
};

module.exports = { createDemographic, updateDemographic, getDemographic, demographicStore };
