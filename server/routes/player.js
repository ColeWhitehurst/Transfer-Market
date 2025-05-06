const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/players', async (req, res) => {
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

module.exports = router;