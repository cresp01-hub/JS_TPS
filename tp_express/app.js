const express = require('express');// importer express.js
const app = express();
let items = [];


app.use(express.json()); // Pour parser les requêtes en JSON

// Point de terminaison GET par défaut
app.get('/', (req, res) => {
  res.send('Bienvenue sur Express.js');
});


app.post('/items', (req, res) => {
  const newItem = { id: items.length + 1, name: req.body.name };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.get('/items', (req, res) => {
    res.json(items);
  });

  
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id); 
    const item = items.find(item => item.id === itemId); 
  
    if (item) {
      res.json(item); 
    } else {
      res.status(404).json({ message: 'Item non trouvé' }); 
    }
  });


  
app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id); 
    const itemIndex = items.findIndex(item => item.id === itemId); 
  
    if (itemIndex !== -1) {
      items[itemIndex].name = req.body.name;
      res.json({ message: 'Item mis à jour avec succès', item: items[itemIndex] });
    } else {
      res.status(404).json({ message: 'Item non trouvé' });
    }
  });
  

  
   app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id); 
    const itemIndex = items.findIndex(item => item.id === itemId); 
  
    if (itemIndex !== -1) {
      items.splice(itemIndex, 1); 
      res.json({ message: 'Item supprimé avec succès' });
    } else {
      res.status(404).json({ message: 'Item non trouvé' });
    }
  });
  
  app.listen(3001, () => {
    console.log("Serveur démarré sur le port 3001");
  });
