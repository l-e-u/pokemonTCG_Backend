import 'dotenv/config';
import express, { json } from 'express';
import { connectToDatabase } from './models/index.js';
import cors from 'cors';

import cardRoutes from './routes/route.cards.js';
import expansionRoutes from './routes/route.expansions.js';
import pokemonRoutes from './routes/route.pokemons.js';
import seriesRoutes from './routes/route.series.js';

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(json());

// middleware
app.use((req, res, next) => {
   console.log(req.path, req.method);
   next();
});

// routes
app.use('/cards', cardRoutes);
app.use('/expansions', expansionRoutes);
app.use('/pokemon', pokemonRoutes);
app.use('/series', seriesRoutes);

// connect to database, then listen to port
connectToDatabase(MONGODB_URI)
   .then(() => {
      console.log('Connected to database.')

      app.listen(PORT, () => console.log(`PokemonTCG_Backend listening on ${PORT}`));
   });