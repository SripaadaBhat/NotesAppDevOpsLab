const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const filePath = path.join('/tmp', 'notes.json');

// Serve index.html at root explicitly (needed for Vercel)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all notes
app.get('/notes', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.json([]);
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// Add note
app.post('/notes', (req, res) => {
    const { text } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        let notes = [];

        if (!err && data) {
            notes = JSON.parse(data);
        }

        const newNote = {
            id: Date.now(),
            text
        };

        notes.push(newNote);

        fs.writeFile(filePath, JSON.stringify(notes, null, 2), () => {
            res.json(newNote);
        });
    });
});

// Delete note
app.delete('/notes/:id', (req, res) => {
    const id = Number(req.params.id);

    fs.readFile(filePath, 'utf8', (err, data) => {
        let notes = JSON.parse(data || '[]');

        notes = notes.filter(note => note.id !== id);

        fs.writeFile(filePath, JSON.stringify(notes, null, 2), () => {
            res.json({ message: 'Deleted successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;