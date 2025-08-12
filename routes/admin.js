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

// Admin-Dashboard anzeigen
router.get('/dashboard', ensureAdmin, async (req, res) => {
    try {
        const allProducts = await Product.find({}).populate('comments');
        res.render('admin-dashboard', { products: allProducts, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

// Route zum Löschen einer einzelnen Bewertung
router.post('/delete-review/:id', ensureAdmin, async (req, res) => {
    try {
        const reviewId = req.params.id;
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).send('Review not found.');

        const product = await Product.findById(review.product);
        if (product) {
            const newReviewCount = product.reviewCount - 1;

            if (newReviewCount > 0) {
                const oldSumQuality = product.ratings.quality * product.reviewCount;
                product.ratings.quality = (oldSumQuality - review.ratings.quality) / newReviewCount;

                const oldSumService = product.ratings.service * product.reviewCount;
                product.ratings.service = (oldSumService - review.ratings.service) / newReviewCount;

                const oldSumAtmosphere = product.ratings.atmosphere * product.reviewCount;
                product.ratings.atmosphere = (oldSumAtmosphere - review.ratings.atmosphere) / newReviewCount;
            } else {
                product.ratings.quality = 0;
                product.ratings.service = 0;
                product.ratings.atmosphere = 0;
            }

            product.reviewCount = newReviewCount;
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

// Neue Route zum Löschen eines ganzen Produkts
router.post('/delete-product/:id', ensureAdmin, async (req, res) => {
    try {
        const productId = req.params.id;

        // 1. Alle zugehörigen Reviews löschen
        await Review.deleteMany({ product: productId });

        // 2. Das Produkt-Dokument selbst löschen
        await Product.findByIdAndDelete(productId);

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

module.exports = router;