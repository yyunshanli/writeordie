const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/summarize', async (req, res) => {
    console.log('Received request at Node.js server with content:', req.body.content);
    try {
        const text = req.body.content;

        console.log('Text received for summarization:', text);

        const response = await axios.post('http://localhost:5000/summarize', { content: text }); // 5-second timeout
        const summary = response.data.summary;

        console.log('Response from summarization service:', response.data);

        res.json({ summary: summary });
    } catch (error) {
        console.error('Error calling Python function:', error);
        res.status(500).json({ error: 'Error summarizing text' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
