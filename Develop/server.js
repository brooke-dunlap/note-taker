const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;


//Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//HTML route returning notes.html
app.get('/notes', (req,res) => {
    console.info(`${req.method} request for returning notes.html`);
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});


//API route reading from db.json and returns notes as JSON
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({error: 'Failed to read notes data'});
        }
        res.json(JSON.parse(data));
    });
});

//API route to add new notes
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} received to add a note`);
    const {title, text} = req.body;
    if (!title || !text){
        return res.status(400).json({error: 'A title and text are required for your note'});
    }

    const newNote = {
        id: uuidv4(), 
        title, 
        text,
    };

    fs.readFile('db/db.json', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({error: 'Failed to read notes data'});
        }

        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile('db/db.json', JSON.stringify(notes), err => {
            if (err) {
                console.log(err);
                return res.status(500).json({error: 'Failed to save note'});
            }
            res.json(newNote);
        });
    });
});

//HTML route returning index.html
app.get('*', (req, res) => {
    console.info(`${req.method} request for returning index.html`);
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
  );