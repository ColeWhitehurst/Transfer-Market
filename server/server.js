// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/players', async (req, res) => {
    const players = await prisma.player.findMany({ include: { team: true } });
    res.json(players);
  });  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
