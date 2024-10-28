import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express'; 
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 4000;

const corsOptions = {
    origin: 'http://localhost:4000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.use(cors(corsOptions));
  
app.use(express.json());

//  MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/bookTracker', {
    serverSelectionTimeoutMS: 15000 
});

//  schéma du livre
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  pages: Number,
  status: String,
  price: Number,
  pagesRead: Number,
  format: String,
  suggestedBy: String,
  finished: Boolean,
});

const Book = mongoose.model('Book', bookSchema);

//chemin de base 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname)); 


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Chemin vers index.html
});

// Route pour récupérer tous les livres
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Route pour ajouter un nouveau livre
app.post('/books', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).send(book);
});

// Lancer le serveur
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
