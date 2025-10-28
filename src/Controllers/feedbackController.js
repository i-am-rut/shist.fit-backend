const Feedback = require('../models/Feedback');

const sendFeedback = async (req, res) => {
    try {
        const userId = req.user._id;
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: "Feedback message is required." });
        }

        if(message.trim().length > 2000) {
            return res.status(400).json({error: 'Feedback can not be more than 2000 characters.'})
        }

        const feedback = new Feedback({
            user: userId,
            message: message.trim(),
        });

        await feedback.save();

        res.status(201).json({ message: "Feedback submitted successfully.", feedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { sendFeedback };
