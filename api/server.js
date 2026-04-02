const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Path to PageSEO and Blog models (assuming they are in the same folder for now or relative)
// If they are only in the backend folder, you must copy the models folder to the api/ directory too!
// I will assume you will copy the 'models' folder into 'api/' on GitHub.

// Required Models
require('./models/PageSEO');
require('./models/Blog');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB error:', err));

// Dynamic SEO Injector Catch-all
app.get(/.*/, async (req, res) => {
    try {
        const url = req.path;
        const pathParts = url.split('/').filter(p => p);
        const firstPart = pathParts[0]?.toLowerCase();

        let section = 'home';
        if (firstPart) {
            const validSections = ['services', 'gallery', 'about', 'team', 'blog', 'booking', 'contact', 'pets-care', 'privacy', 'terms', 'privacy-policy', 'terms-of-service'];
            if (validSections.includes(firstPart)) {
                section = firstPart;
            }
        }

        // Default Meta Tags
        let title = 'Kings Pet Hospital | Trusted Pet Care';
        let description = 'Professional pet care services and expert veterinarians.';
        let keywords = 'Pet Care, Hospital, Veterinary';

        // 1. Fetch from DB (We skip some complexity for a simple monolith check)
        // Note: You must ensure 'PageSEO' model is available here!
        try {
            const PageSEO = mongoose.model('PageSEO'); // If already registered
            const seoData = await PageSEO.findOne({ section: { $regex: new RegExp('^' + section + '$', 'i') } });
            if (seoData) {
                title = seoData.title || title;
                description = seoData.metaDescription || seoData.description || description;
                keywords = seoData.seoText || keywords;
            }
        } catch (e) {
            console.log('SEO DB Fetch error (using defaults)', e.message);
        }

        // 2. Inject into HTML
        // In Vercel serverless, we look for the static file in the built output
        const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
        if (!fs.existsSync(indexPath)) {
            return res.status(404).send('Site build not found.');
        }

        let html = fs.readFileSync(indexPath, 'utf8');
        html = html.replace(/{{SEO_TITLE}}/g, title);
        html = html.replace(/{{SEO_DESCRIPTION}}/g, description || '');
        html = html.replace(/{{SEO_KEYWORDS}}/g, keywords || '');

        res.send(html);
    } catch (err) {
        res.status(500).send('Internal Error');
    }
});

module.exports = app;
