// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Your secret API key for file access
const SECRET_API_KEY = 'standard_55d8d5efd7e5181bcf3830a54693f7cdee7e93ead594232f211ae930e9c0ec8922c5beaac9f1bf513d7d954b06f20f4fb1ce958170752d01597915744fa1d96818f107ddda57c3d2388d861d5507dbf9f6218204167b14435bfba6a7335f64a967398738ffdd9e8e97c2652c61dc1acf0a09b8522c92d92b3b758f3849df2ece';

// Middleware to validate API key and block browsers
app.use((req, res, next) => {
    const url = req.url.toLowerCase();
    
    // Check if the request is for .txt or .lua files
    if (url.endsWith('.txt') || url.endsWith('.lua')) {
        const userAgent = req.headers['user-agent'] || '';
        const apiKey = req.headers['x-api-key'] || req.query.apikey;
        
        // Check if it's a Roblox request OR has valid API key
        const isRobloxRequest = userAgent.includes('Roblox') || 
                               userAgent.includes('HttpService') ||
                               userAgent.includes('RobloxStudio');
        
        const hasValidApiKey = apiKey === SECRET_API_KEY;
        
        if (!isRobloxRequest && !hasValidApiKey) {
            // Block unauthorized access
            console.log(`Blocked unauthorized access to: ${req.url} from IP: ${req.ip}`);
            return res.redirect(302, 'https://idx.lol');
        }
        
        // Log successful authorized access
        console.log(`Allowed access to: ${req.url} - Roblox: ${isRobloxRequest}, API Key: ${hasValidApiKey}`);
    }
    
    next();
});

// Serve static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Catch-all route
app.get('*', (req, res) => {
    res.send('Server is running. .txt and .lua files require Roblox or valid API key.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Blocking .txt and .lua files for unauthorized requests...');
    console.log('Allowed: Roblox requests and requests with valid API key');
});
