const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const { position } = req.query;

  try {
    const players = await prisma.player.findMany({
      where: {
        position: position || undefined,
      },
      include: {
        team: true,
      },
    });

    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const player = await prisma.player.findUnique({
      where: { id: parseInt(id) },
      include: { team: true },
    });

    if (!player) return res.status(404).json({ error: 'Player not found' });

    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

router.get('/search', async (req, res) => {
  const { age, maxValue, position } = req.query;

  try {
    const players = await prisma.player.findMany({
      where: {
        ...(age && { age: parseInt(age) }),
        ...(maxValue && { marketValue: { lte: parseInt(maxValue) } }),
        ...(position && { position }),
      },
      include: { team: true },
    });

    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search players' });
  }
});

module.exports = router;