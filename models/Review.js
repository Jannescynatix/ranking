const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    ratings: {
        quality: { type: Number, min: 1, max: 6, required: true },
        service: { type: Number, min: 1, max: 6, required: true },
        atmosphere: { type: Number, min: 1, max: 6, required: true }
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', ReviewSchema);