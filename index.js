require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Note = require('./models/note');

const app = express();
app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());

app.get('/api', (req,res) => {
   res.send('<h1>Notes API</h1>');
})

app.get('/api/notes', (req,res) => {
   Note.find({}).then(notes => {
      res.json(notes.map(note => note.toJSON()));
   })
});

app.get('/api/notes/:id', (request, response) => {
   Note.findById(request.params.id).then(note => {
      response.json(note.toJSON());
   });
});

app.post('/api/notes', (request, response) => {
   const body = request.body;
   if(!body.content) {
      return response.status(400).json({
         error: 'content missing',
      });
   }
   const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
   });
   note.save().then(savedNote => {
      response.json(savedNote.toJSON());
   });
 });

app.delete('/api/notes/:id', (req,res) => {
   const id = Number(req.params.id);
   notes = notes.filter(note => note.id !== id);
   res.status(204).end();
});

const PORT =  process.env.PORT;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);

});
