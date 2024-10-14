#!/usr/bin/env node
import axios from 'axios';
import inquirer from 'inquirer';

// Fonction pour obtenir les données d'un Pokémon à partir de l'API
async function fetchPokemonData(pokemonName) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du Pokémon.');
    return null;
  }
}

// Fonction pour obtenir les données d'une attaque
async function fetchMoveData(moveUrl) {
  try {
    const response = await axios.get(moveUrl);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du mouvement.');
    return null;
  }
}

// Classe représentant un joueur
class PokemonTrainer {
  constructor(pokemonData) {
    this.name = pokemonData.name;
    this.hp = 300;
    this.moves = [];
    this.initializeMoves(pokemonData.moves);
  }

  // Récupérer les 5 premières attaques disponibles
  async initializeMoves(availableMoves) {
    const movePromises = availableMoves.slice(0, 5).map(async (move) => {
      const moveData = await fetchMoveData(move.move.url);
      return {
        name: moveData.name,
        power: moveData.power || 0,
        accuracy: moveData.accuracy || 100,
        pp: moveData.pp || 0,
      };
    });
    this.moves = await Promise.all(movePromises);
    this.moves = this.moves.filter((move) => move.name && (move.power || move.accuracy));
  }

  // Réaliser une attaque
  performMove(moveIndex, opponent) {
    const selectedMove = this.moves[moveIndex];

    if (!selectedMove) {
      console.log(`${this.name} n'a pas pu utiliser l'attaque.`);
      return false;
    }

    if (selectedMove.pp <= 0) {
      console.log(`${this.name} a essayé d'utiliser ${selectedMove.name}, mais il n'a plus de PP.`);
      return false;
    }

    selectedMove.pp--;

    const hitChance = Math.random() * 100;
    if (hitChance > selectedMove.accuracy) {
      console.log(`${this.name} rate son attaque ${selectedMove.name}.`);
      return false;
    }

    opponent.hp -= selectedMove.power;
    if (opponent.hp < 0) opponent.hp = 0;
    console.log(`${this.name} utilise ${selectedMove.name} et inflige ${selectedMove.power} dégâts à ${opponent.name}.`);

    return true;
  }

  // Vérifier si le joueur est encore en vie
  isAlive() {
    return this.hp > 0;
  }
}

// Sélection du mouvement du bot : choisir un mouvement aléatoire
function selectBotMove(trainer) {
  const randomMoveIndex = Math.floor(Math.random() * trainer.moves.length);
  return randomMoveIndex;
}

// Boucle de jeu
async function startBattle(playerPokemonName) {
  const playerPokemonData = await fetchPokemonData(playerPokemonName);
  const randomPokemonId = Math.floor(Math.random() * 898) + 1; // Sélectionne un Pokémon aléatoire pour le bot
  const botPokemonData = await fetchPokemonData(randomPokemonId.toString());

  if (!playerPokemonData || !botPokemonData) {
    console.log("Erreur lors de la récupération des données des Pokémon.");
    return;
  }

  const player = new PokemonTrainer(playerPokemonData);
  const bot = new PokemonTrainer(botPokemonData);

  console.log(`Un ${bot.name} sauvage apparaît !`);
  console.log(`${player.name}, je te choisis !\n`);

  await Promise.all([player.initializeMoves(playerPokemonData.moves), bot.initializeMoves(botPokemonData.moves)]);

  while (player.isAlive() && bot.isAlive()) {
    const moveChoices = player.moves.map((move, index) => ({
      name: `${move.name} (PP: ${move.pp}, Puissance: ${move.power}, Précision: ${move.accuracy})`,
      value: index,
    }));

    const { chosenMoveIndex } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chosenMoveIndex',
        message: 'Choisissez une attaque :',
        choices: moveChoices,
      },
    ]);

    player.performMove(chosenMoveIndex, bot);

    if (!bot.isAlive()) {
      console.log(`\n${bot.name} est K.O. Vous avez gagné !`);
      break;
    }

    const botMoveIndex = selectBotMove(bot);
    bot.performMove(botMoveIndex, player);

    if (!player.isAlive()) {
      console.log(`\n${player.name} est K.O. Vous avez perdu.`);
      break;
    }

    console.log(`\n${player.name} : ${player.hp} HP restants.`);
    console.log(`${bot.name} : ${bot.hp} HP restants.\n`);
  }
}

// Démarrer le jeu
async function launchGame() {
  const { chosenPokemon } = await inquirer.prompt([
    {
      type: 'input',
      name: 'chosenPokemon',
      message: 'Choisissez votre Pokémon : ',
    },
  ]);

  startBattle(chosenPokemon);
}

launchGame();
