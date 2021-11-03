const fspromises = require('fs/promises');
const util = require('util');
const {v4: uuid} = require('uuid');
const notes = require('express').Router();
const {readFromFile} = require('../utils/frs')
// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  fspromises.readFile('./db/db.json','utf8')
  .then((data) => res.json(JSON.parse(data)))
  .catch((error) => console.log(error));
});
// POST route to save a new note
notes.post('/', (req, res) => {
    if(req.body) {
        fspromises.readFile('./db/db.json','utf8')
        .then((data) => {
            const {title, text} = req.body;
            const newNote = {
                title,
                text,
                id: uuid()
            }
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            fspromises.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4))
        .then(() => {
            console.log("success writing to file")
            res.json(`new data saved to note database`);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        }); 
    })
    .catch((error) => {
        console.log(error);
    });    
    }
});
// DELETE route to delete a note
notes.delete('/:noteId',(req, res) => {
    const noteId = req.params.noteId;
    console.log("DeleteNote request")
    fspromises.readFile('./db/db.json','utf8')
    .then((data) => JSON.parse(data))
    .then((data) => {
        const newArr = data.filter((delNote) => delNote.id !== noteId)
        fspromises.writeFile('./db/db.json', JSON.stringify(newArr, null, 4))
        .then(() => {
            console.log("success writing new file")
            res.json(`Note deleted from note database`);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        })
    })
    .catch((error) => {
        console.log(error);
    });
});

module.exports = notes;