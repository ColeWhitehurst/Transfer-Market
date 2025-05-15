const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const playerRoutes = require('./routes/players');
const teamRoutes = require('./routes/teams');
const transferRoutes = require('./routes/transfers');
const bidRoutes = require('./routes/bids');
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/bids', bidRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 3000;
console.log("server is running");
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));