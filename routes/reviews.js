const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');

const forbiddenWords = [
    // Originale Wörter aus deiner Liste
    'neger', 'nigga', 'huhrensohn', 'hurensohn', 'hasse',

    // Beleidigungen und rassistische Begriffe
    'wichser', 'wixxer', 'wichsa', 'wixxa', 'fotze', 'fotzen', 'futz', 'futzen',
    'spast', 'spasti', 'spasten', 'schwuchtel', 'schwuli', 'schwul', 'schwil', 'schwiel',
    'schwanz', 'schwänze', 'schwanze', 'homo', 'homu', 'homoe', 'h0mo', 'schwanzlutscher',
    'arsch', 'arschl0ch', 'arschloch', 'arschlöcher', 'kanacke', 'kanake', 'kanacken', 'kanack',
    'kacke', 'kacka', 'kacken', 'scheisse', 'scheiße', 'schisse', 'schiesse', 'shit', 'shite',
    'dreck', 'drecksau', 'drecksack', 'missgeburt', 'missgeburt', 'missgeburten', 'hässlich',
    'hässliche', 'hässlichkeit', 'hure', 'huren', 'nutte', 'nutten', 'nuttensohn', 'nuttenkind',

    // Sexuelle Begriffe
    'porno', 'porn0', 'pornographie', 'pornografie', 'fick', 'ficken', 'gefickt', 'fick dich',
    'fickdich', 'fickt euch', 'fickteuch', 'vergewaltigen', 'vergewaltigung', 'sex', 'sexvideo',
    'sexvideos', 'penis', 'pimmel', 'pimmel', 'vagina', 'muschi', 'möse', 'moese', 'brüste',
    'busen', 'titten', 'titen', 'arschfick', 'anal', 'analsex', 'blowjob', 'blow job',

    // Gewaltverherrlichende Begriffe
    'mord', 'mörder', 'morden', 'töten', 'tötung', 'umbringen', 'abstechen', 'erstechen',
    'erschießen', 'erschiessen', 'schiessen', 'schießen', 'amok', 'amoklauf', 'terror', 'terrorist',
    'bombe', 'sprengstoff', 'massenmord', 'massaker', 'verletzen', 'verletzung', 'schlagen',
    'prügel', 'prügeln', 'foltern', 'folter', 'quälen', 'quaelen',

    // Drogenbezogene Begriffe
    'droge', 'drogen', 'kiffen', 'kiffa', 'kiffer', 'gras', 'gras rauchen', 'koks', 'kokain',
    'heroin', 'lsd', 'ecstasy', 'xtc', 'speed', 'crystal', 'meth', 'cannabis', 'hanf', 'joint',
    'tüte', 'tuete', 'alkohol', 'saufen', 'besoffen', 'betrunken', 'koma saufen', 'komasaufen',

    // Extremistische Begriffe
    'hitler', 'nazi', 'nazis', 'holocaust', 'juden', 'jude', 'antisemit', 'antisemitisch',
    'rassenhass', 'rassenrein', 'white power', 'wp', 'kkk', 'islamist', 'dschihad', 'dschihadist',

    // Abwertende Begriffe
    'idiot', 'idioten', 'dumm', 'dummer', 'depp', 'deppen', 'doof', 'blöd', 'bloede', 'dämlich',
    'daemlich', 'spasten', 'mongoloid', 'behindert', 'behinderte', 'retard', 'retarded', 'spasti',
    'schizo', 'psycho', 'gestört', 'gestoert', 'krank', 'kranker', 'eklig', 'ekelhaft', 'ekelhafte',

    // Variationen mit Zahlen und Sonderzeichen
    'h4sse', 'h4ss3', 'h4ss3', 'hurens0hn', 'huren50hn', 'hurnsohn', 'hurnensohn', 'neger1',
    'n1gger', 'n1gga', 'n1gg3r', 'nigg3r', 'f0tze', 'f0tz3', 'fotz3', 'schwanzlutsch3r',
    'schwanzlutscher', 'schwanzlutsche', 'arschgeige', 'arschgeigen', '4rsch', '4rschloch',
    '4rschl0ch', 'k4nacke', 'k4n4cke', 'k4n4ck3', 'm1stgeburt', 'm1ssgeburt', 'missgebürt',

    // Englische Slang-Begriffe
    'fuck', 'fucker', 'fucking', 'motherfucker', 'motherf*cker', 'mofo', 'bitch', 'bitches',
    'b1tch', 'b1tches', 'cunt', 'c*nt', 'asshole', 'a$$hole', 'ass', 'a$$', 'dick', 'd1ck',
    'pussy', 'p*ssy', 'pussies', 'whore', 'slut', 's1ut', 'bastard', 'b*stard', 'retard', 'r*tard',

    // Abkürzungen und Codewörter
    'afd', 'npd', 'kkk', 'nsdap', 'ss', 'sa', 'wtf', 'omg', 'lol', 'rofl', 'lmfao', 'stfu',
    'gtfo', 'kys', 'kill yourself', 'selfharm', 'self harm', 'suizid', 'suicide', 'selbstmord',

    // Weitere Variationen
    'hurn', 'hurns', 'hurnkind', 'nuttenkind', 'nutten sohn', 'nutten sohn', 'nuttenkind',
    'schwanzlutsch', 'schwanzlutschen', 'schwanzlutscherin', 'fotzen', 'fotzengesicht',
    'fotzenkind', 'fotzenschlampe', 'schlampe', 'schlampen', 'schlampe', 'schlampig',
    'hurenkind', 'hurenkinder', 'hurensohn', 'hurensöhne', 'hurentochter', 'hurentöchter',

    // Extremere Varianten
    'tod', 'sterben', 'sterb', 'sterbt', 'totschlag', 'totschlagen', 'umbringen', 'umbringt',
    'selbstmord', 'selbstmord begehen', 'sich umbringen', 'sich das leben nehmen',
    'lebensmüde', 'lebensmuede', 'kein lebenswillen', 'kein lebenswille',

    // Weitere sexuelle Begriffe
    'pimmel', 'pimmeln', 'pimmelchen', 'pimmelfresse', 'pimmelgesicht', 'vagina', 'vaginen',
    'muschi', 'muschie', 'möse', 'moese', 'moesen', 'brüste', 'bruste', 'busen', 'titten',
    'tittenfick', 'titjob', 'tit job', 'tittenficker', 'arschficker', 'arschficken',

    // Weitere rassistische Begriffe
    'ausländer', 'auslaender', 'ausländer raus', 'ausländerfeindlich', 'ausländerhass',
    'fremdenfeindlich', 'fremdenhass', 'rassist', 'rassistisch', 'rassenhass', 'rassenkrieg',
    'rassenreinheit', 'rassenwahn', 'nazitum', 'nazistische', 'nazischwein', 'nazischweine',

    // Weitere gewaltverherrlichende Begriffe
    'messer', 'messerstecherei', 'messerstich', 'messerattacke', 'schusswaffe', 'schusswaffen',
    'waffe', 'waffen', 'schießen', 'schiessen', 'erschießen', 'erschiessen', 'töten', 'toeten',
    'mord', 'morden', 'mörder', 'moerder', 'mörderisch', 'moerderisch', 'amok', 'amoklauf',
    'amokläufer', 'amoklaeufer', 'terror', 'terrorist', 'terroristen', 'terrorismus', 'bombe',
    'bomben', 'sprengstoff', 'sprengsatz', 'massaker', 'massakers', 'massenmord', 'massenmorde',

    // Weitere abwertende Begriffe
    'hässlich', 'haesslich', 'hässlichkeit', 'haesslichkeit', 'eklig', 'ekelhaft', 'ekelhafte',
    'ekelerregend', 'ekelerregende', 'widerlich', 'widerliche', 'abstoßend', 'abstossend',
    'abartig', 'abartige', 'pervers', 'perverse', 'perversion', 'perversität', 'perversitaet',
    'krank', 'kranke', 'krankheit', 'krankheiten', 'gestört', 'gestoert', 'gestörte', 'gestoerte',
    'psycho', 'psychopath', 'psychopathen', 'schizo', 'schizophren', 'schizophrene', 'behindert',
    'behinderte', 'behinderung', 'behinderungen', 'mongoloid', 'mongoloide', 'spast', 'spasten',
    'spasti', 'spastis', 'idiot', 'idioten', 'idiotisch', 'dumm', 'dummer', 'dumme', 'dummheit',
    'depp', 'deppen', 'deppert', 'doof', 'doofe', 'blöd', 'bloede', 'blödheit', 'bloedeheit',
    'dämlich', 'daemlich', 'dämlichkeit', 'daemlichkeit', 'retard', 'retarded', 'retardiert',
    'retardierte', 'spasti', 'spastis', 'spastiker', 'spastikerin', 'spastikern',

    // Weitere Variationen mit Zahlen und Sonderzeichen
    'h4sslich', 'h4esslich', 'hässl1ch', 'haessl1ch', '3klig', '3kelhaft', '3kelhafte',
    '3kelerregend', '3kelerregende', 'w1derlich', 'w1derliche', 'abst0ßend', 'abst0ssend',
    'ab4rtig', 'ab4rtige', 'p3rvers', 'p3rverse', 'p3rversion', 'p3rversität', 'p3rversitaet',
    'kr4nk', 'kr4nke', 'kr4nkheit', 'kr4nkheiten', 'g3stört', 'g3stoert', 'g3störte', 'g3stoerte',
    'psych0', 'psych0path', 'psych0pathen', 'sch1zo', 'sch1zophren', 'sch1zophrene', 'b3hindert',
    'b3hinderte', 'b3hinderung', 'b3hinderungen', 'm0ngoloid', 'm0ngoloide', 'sp4st', 'sp4sten',
    'sp4sti', 'sp4stis', '1diot', '1dioten', '1diotisch', 'dumm', 'dumm3', 'dumm3', 'dummh3it',
    'd3pp', 'd3ppen', 'd3ppert', 'd00f', 'd00fe', 'bl0d', 'bl0ede', 'bl0dheit', 'bl0edeheit',
    'd4mlich', 'd4emlich', 'd4mlichkeit', 'd4emlichkeit', 'r3tard', 'r3tarded', 'r3tardiert',
    'r3tardierte', 'sp4sti', 'sp4stis', 'sp4stiker', 'sp4stikerin', 'sp4stikern',

    // Extremere Varianten
    't0t', 'st3rben', 'st3rb', 'st3rbt', 't0tschlag', 't0tschlagen', 'umbring3n', 'umbringt',
    's3lbstmord', 's3lbstmord begehen', 'sich umbring3n', 'sich das leb3n nehmen',
    'leb3nsmüde', 'leb3nsmuede', 'kein leb3nswillen', 'kein leb3nswille',

    // Weitere sexuelle Begriffe
    'p1mmel', 'p1mmeln', 'p1mmelchen', 'p1mmelfresse', 'p1mmelgesicht', 'v4gina', 'v4ginen',
    'm3uschi', 'm3uschie', 'm0se', 'm0ese', 'm0esen', 'br3ste', 'brust3', 'bus3n', 't1tten',
    't1ttenfick', 't1tjob', 't1t job', 't1ttenficker', '4rschficker', '4rschficken',

    // Weitere rassistische Begriffe
    '4usländer', '4uslaender', '4usländer raus', '4usländerfeindlich', '4usländerhass',
    'fr3mdenfeindlich', 'fr3mdenhass', 'r4ssist', 'r4ssistisch', 'r4ssenhass', 'r4ssenkrieg',
    'r4ssenreinheit', 'r4ssenwahn', 'n4zitum', 'n4zistische', 'n4zischwein', 'n4zischweine',

    // Weitere gewaltverherrlichende Begriffe
    'm3sser', 'm3sserstecherei', 'm3sserstich', 'm3sserattacke', 'schussw4ffe', 'schussw4ffen',
    'w4ffe', 'w4ffen', 'schieß3n', 'schiess3n', 'erschieß3n', 'erschiess3n', 't0ten', 't0eten',
    'm0rd', 'm0rden', 'm0rder', 'm0erder', 'm0rderisch', 'm0erderisch', '4mok', '4moklauf',
    '4mokläufer', '4moklaeufer', 't3rror', 't3rrorist', 't3rroristen', 't3rrorismus', 'b0mbe',
    'b0mben', 'spr3ngstoff', 'spr3ngsatz', 'm4ssaker', 'm4ssakers', 'm4ssenmord', 'm4ssenmorde',

    // Weitere abwertende Begriffe
    'h4sslich', 'h4esslich', 'h4sslichkeit', 'h4esslichkeit', '3klig', '3kelhaft', '3kelhafte',
    '3kelerregend', '3kelerregende', 'w1derlich', 'w1derliche', 'abst0ßend', 'abst0ssend',
    'ab4rtig', 'ab4rtige', 'p3rvers', 'p3rverse', 'p3rversion', 'p3rversität', 'p3rversitaet',
    'kr4nk', 'kr4nke', 'kr4nkheit', 'kr4nkheiten', 'g3stört', 'g3stoert', 'g3störte', 'g3stoerte',
    'psych0', 'psych0path', 'psych0pathen', 'sch1zo', 'sch1zophren', 'sch1zophrene', 'b3hindert',
    'b3hinderte', 'b3hinderung', 'b3hinderungen', 'm0ngoloid', 'm0ngoloide', 'sp4st', 'sp4sten',
    'sp4sti', 'sp4stis', '1diot', '1dioten', '1diotisch', 'dumm', 'dumm3', 'dumm3', 'dummh3it',
    'd3pp', 'd3ppen', 'd3ppert', 'd00f', 'd00fe', 'bl0d', 'bl0ede', 'bl0dheit', 'bl0edeheit',
    'd4mlich', 'd4emlich', 'd4mlichkeit', 'd4emlichkeit', 'r3tard', 'r3tarded', 'r3tardiert',
    'r3tardierte', 'sp4sti', 'sp4stis', 'sp4stiker', 'sp4stikerin', 'sp4stikern',

    // Extremere Varianten
    't0t', 'st3rben', 'st3rb', 'st3rbt', 't0tschlag', 't0tschlagen', 'umbring3n', 'umbringt',
    's3lbstmord', 's3lbstmord begehen', 'sich umbring3n', 'sich das leb3n nehmen',
    'leb3nsmüde', 'leb3nsmuede', 'kein leb3nswillen', 'kein leb3nswille',

    // Weitere sexuelle Begriffe
    'p1mmel', 'p1mmeln', 'p1mmelchen', 'p1mmelfresse', 'p1mmelgesicht', 'v4gina', 'v4ginen',
    'm3uschi', 'm3uschie', 'm0se', 'm0ese', 'm0esen', 'br3ste', 'brust3', 'bus3n', 't1tten',
    't1ttenfick', 't1tjob', 't1t job', 't1ttenficker', '4rschficker', '4rschficken',

    // Weitere rassistische Begriffe
    '4usländer', '4uslaender', '4usländer raus', '4usländerfeindlich', '4usländerhass',
    'fr3mdenfeindlich', 'fr3mdenhass', 'r4ssist', 'r4ssistisch', 'r4ssenhass', 'r4ssenkrieg',
    'r4ssenreinheit', 'r4ssenwahn', 'n4zitum', 'n4zistische', 'n4zischwein', 'n4zischweine',

    // Weitere gewaltverherrlichende Begriffe
    'm3sser', 'm3sserstecherei', 'm3sserstich', 'm3sserattacke', 'schussw4ffe', 'schussw4ffen',
    'w4ffe', 'w4ffen', 'schieß3n', 'schiess3n', 'erschieß3n', 'erschiess3n', 't0ten', 't0eten',
    'm0rd', 'm0rden', 'm0rder', 'm0erder', 'm0rderisch', 'm0erderisch', '4mok', '4moklauf',
    '4mokläufer', '4moklaeufer', 't3rror', 't3rrorist', 't3rroristen', 't3rrorismus', 'b0mbe',
    'b0mben', 'spr3ngstoff', 'spr3ngsatz', 'm4ssaker', 'm4ssakers', 'm4ssenmord', 'm4ssenmorde'
];

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