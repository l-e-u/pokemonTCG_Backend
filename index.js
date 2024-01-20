import 'dotenv/config';
import express, { json } from 'express';
import { connectToDatabase } from './models/index.js';
import cors from 'cors';

import elementRoutes from './routes/route.elements.js';

const port = 3000;
const mongoDB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(json());

// middleware
app.use((req, res, next) => {
   console.log(req.path, req.method);
   next();
});

// routes
app.use('/elements', elementRoutes);

connectToDatabase(mongoDB_URI)
   .then(() => {
      console.log('Connected to database.')

      app.listen(port, () => {
         console.log(`PokemonTCG_Backend listening on ${port}`);
      });
   });