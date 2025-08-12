const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');

const forbiddenWords = ['word1', 'word2', 'word3']; // Ihre Liste verbotener Wörter

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Dashboard-Ansicht (alle Bewertungen)
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const products = await Product.find({}).populate('comments');
        res.render('dashboard', { user: req.user, products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

// Seite zum Hinzufügen einer neuen Bewertung
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('new-review');
});

// Eine neue Bewertung absenden
router.post('/new', ensureAuthenticated, async (req, res) => {
    const { name, quality, service, atmosphere, comment } = req.body;

    // Wortfilterung
    const containsForbiddenWords = forbiddenWords.some(word =>
        name.toLowerCase().includes(word) || comment.toLowerCase().includes(word)
    );
    if (containsForbiddenWords) {
        return res.status(400).send('Fehler: Ihr Name oder Kommentar enthält verbotene Wörter.');
    }

    try {
        let product = await Product.findOne({ name });
        if (product) {
            // Logik für vorhandenes Produkt
            const newReview = new Review({
                product: product._id,
                ratings: { quality, service, atmosphere },
                comment
            });
            await newReview.save();

            // Durchschnittswerte aktualisieren
            product.ratings.quality = (product.ratings.quality * product.reviewCount + parseInt(quality)) / (product.reviewCount + 1);
            product.ratings.service = (product.ratings.service * product.reviewCount + parseInt(service)) / (product.reviewCount + 1);
            product.ratings.atmosphere = (product.ratings.atmosphere * product.reviewCount + parseInt(atmosphere)) / (product.reviewCount + 1);
            product.reviewCount++;
            product.comments.push(newReview._id);
            await product.save();
        } else {
            // Logik für neues Produkt
            const newProduct = new Product({
                name,
                ratings: { quality, service, atmosphere },
                reviewCount: 1,
            });
            const newReview = new Review({
                product: newProduct._id,
                ratings: { quality, service, atmosphere },
                comment
            });
            newProduct.comments.push(newReview._id);
            await newProduct.save();
            await newReview.save();
        }
        res.redirect('/reviews/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

module.exports = router;