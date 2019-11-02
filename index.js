require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Note = require('./models/note');

const app = express();
app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());

app.get('/api', (req, res) => {
   res.send('<h1>Notes API</h1>');
})

app.get('/api/notes', (req, res) => {
   Note.find({}).then(notes => {
      res.json(notes.map(note => note.toJSON()));
   })
});

app.get('/api/notes/:id', (request, response, next) => {
   Note.findById(request.params.id).then(note => {
      if (note) {
         response.json(note.toJSON());
      } else {
         response.status(404).end();
      }
   }).catch(err => next(err))
});

app.post('/api/notes', (request, response, next) => {
   const body = request.body;
   if (!body.content) {
      return response.status(400).json({
         error: 'content missing',
      });
   }
   const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
   });
   note.save()
   .then(savedNote => savedNote.toJSON())
   .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
   })
   .catch(error => next(error))
});

app.put('/api/notes/:id', (request, response, next) => {
   const body = request.body;
   const note = {
      content: body.content,
      important: body.important,
   }
   Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
         response.json(updatedNote.toJSON());
      })
      .catch(error => next(error));
});

app.delete('/api/notes/:id', (req, res, next) => {
   Note.findByIdAndDelete(req.params.id).then(response => {
      res.status(204).end();
   }).catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
   console.error(error.message)
   if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' });
   } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
   } 
   next(error);
}
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);

});
