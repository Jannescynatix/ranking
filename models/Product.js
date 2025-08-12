const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    ratings: {
        quality: { type: Number, default: 0 },
        service: { type: Number, default: 0 },
        atmosphere: { type: Number, default: 0 }
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

module.exports = mongoose.model('Product', ProductSchema);