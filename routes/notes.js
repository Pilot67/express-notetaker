const fs = require('fs');
const util = require('util');
const {v4: uuid} = require('uuid');
const notes = require('express').Router();
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

// const { readFromFile, readAndAppend } = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json','utf8')
  .then((data) => res.json(JSON.parse(data)))
  .catch((error) => console.log(error));
});

// POST route to save a new note
notes.post('/', (req, res) => {
    if(req.body) {
        readFromFile('./db/db.json','utf8')
        .then((data) => {
            const {title, text} = req.body;
            const newNote = {
                title,
                text,
                id: uuid()
            }
            console.log(newNote);
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            writeToFile('./db/db.json', JSON.stringify(parsedData, null, 4))
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

notes.delete('/:noteId',(req, res) => {
    const noteId = req.params.noteId;
    console.log("DeleteNote request")
    console.log(noteId)
    readFromFile('./db/db.json','utf8')
    .then((data) => JSON.parse(data))
    .then((data) => {
        const newArr = data.filter((delNote) => delNote.id !== noteId)
        writeToFile('./db/db.json', JSON.stringify(newArr, null, 4))
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