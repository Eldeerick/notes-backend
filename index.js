const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());

const url =
<<<<<<< HEAD
  `mongodb+srv://elderick:<password>@phonebook-yajra.mongodb.net/note-app?retryWrites=true&w=majority`
=======
  `mongodb+srv://elderick:fullstack@phonebook-yajra.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
   }
});

const Note = mongoose.model('Note', noteSchema)

>>>>>>> parent of 6b82ff4... Revert "Get method access database now"
let notes = [
   {
     id: 1,
     content: "HTML is easy",
     date: "2019-05-30T17:30:31.098Z",
     important: true
   },
   {
     id: 2,
     content: "Browser can execute only Javascript",
     date: "2019-05-30T18:39:34.091Z",
     important: false
   },
   {
     id: 3,
     content: "GET and POST are the most important methods of HTTP protocol",
     date: "2019-05-30T19:20:14.298Z",
     important: true
   }
 ]

app.get('/api', (req,res) => {
   res.send('<h1>Notes API</h1>');
})

app.get('/api/notes', (req,res) => {
   Note.find({}).then(notes => {
      res.json(notes.map(note => note.toJSON()));
   })
});

app.get('/api/notes/:id', (req,res) => {
   const id = Number(req.params.id);
   const note = notes.find(note => note.id === id);
   if(note) {
      res.json(note);
   } else {
      res.status(404).end();
   }
});

const generateId = () => {
   const maxId = notes.length > 0 
   ? Math.max(...notes.map(n => n.id))
   : 0
   return maxId + 1;
}

app.post('/api/notes', (request, response) => {
   const body = request.body;
   if(!body.content) {
      return response.status(400).json({
         error: 'content missing',
      });
   }
   const note = {
      content: body.content,
      important: body.important || false,
      date: new Date(),
      id: generateId(),
   }
   notes = notes.concat(note);
   response.json(note)
 });

app.delete('/api/notes/:id', (req,res) => {
   const id = Number(req.params.id);
   notes = notes.filter(note => note.id !== id);
   res.status(204).end();
});

const PORT =  process.env.PORT || 3001;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);

});
