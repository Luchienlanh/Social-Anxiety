const { createLifestyleSchema, updateLifestyleSchema } = require("../validators/lifestyle");

const lifestyleStore = new Map();

const createLifestyle = async (req, res) => {
    try {
        const { value, error } = createLifestyleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sessionId = req.headers['x-session-id'] || Date.now().toString();
        lifestyleStore.set(sessionId, value);

        return res.status(201).json({
            success: true,
            message: 'Lifestyle data saved',
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

const updateLifestyle = async (req, res) => {
    try {
        const { value, error } = updateLifestyleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sessionId = req.headers['x-session-id'];
        if (!sessionId || !lifestyleStore.has(sessionId)) {
            return res.status(404).json({
                success: false,
                message: 'Session not found. Please create lifestyle first.'
            });
        }

        const existing = lifestyleStore.get(sessionId);
        const updated = { ...existing, ...value };
        lifestyleStore.set(sessionId, updated);

        return res.status(200).json({
            success: true,
            message: 'Lifestyle data updated',
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

const getLifestyle = async (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !lifestyleStore.has(sessionId)) {
        return res.status(404).json({ success: false, message: 'Not found' });
    }
    return res.status(200).json({
        success: true,
        data: lifestyleStore.get(sessionId)
    });
};

module.exports = { createLifestyle, updateLifestyle, getLifestyle, lifestyleStore };
