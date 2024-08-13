const express = require('express');
const axios = require('axios');
const path = require('path');

// initialize Express application
const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// route to handle POST requests to '/summarize'
app.post('/summarize', async (req, res) => {
    console.log('Received request at Node.js server with content:', req.body.content);
    try {
        // extract text content from request
        const text = req.body.content;

        console.log('Text received for summarization:', text);

        // forward text to Flask application
        const response = await axios.post('http://localhost:5000/summarize', { content: text });
        const summary = response.data.summary;

        console.log('Response from summarization service:', response.data);

        // send summary back to client 
        res.json({ summary: summary });
    } catch (error) { //error handling
        console.error('Error calling Python function:', error);
        res.status(500).json({ error: 'Error summarizing text' });
    }
});

// start server and listen for requests
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
