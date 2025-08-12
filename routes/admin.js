const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    res.status(403).send('Access denied.');
}

// Admin-Dashboard
router.get('/dashboard', ensureAdmin, async (req, res) => {
    try {
        const allProducts = await Product.find({}).populate('comments');
        res.render('admin-dashboard', { products: allProducts, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

// Bewertung löschen
router.post('/delete-review/:id', ensureAdmin, async (req, res) => {
    try {
        const reviewId = req.params.id;
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).send('Review not found.');

        const product = await Product.findById(review.product);
        if (product) {
            // Durchschnittswerte neu berechnen
            const oldRatingSum = product.reviewCount * product.ratings.quality;
            product.ratings.quality = (oldRatingSum - review.ratings.quality) / (product.reviewCount - 1);
            product.reviewCount--;
            // TODO: Repeat for other ratings (service, atmosphere)

            // Kommentare im Produkt aktualisieren
            product.comments.pull(reviewId);
            await product.save();
        }

        await Review.findByIdAndDelete(reviewId);
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

module.exports = router;