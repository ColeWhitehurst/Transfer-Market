const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

const { isAuthenticated } = require('../middleware/auth');

router.patch("/", isAuthenticated, async (req, res) => {
  const { playerId, newTeamId, offer } = req.body;

  if (!playerId || !newTeamId || !offer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    const team = await prisma.team.findUnique({ where: { id: newTeamId } });

    if (!player || !team) {
      return res.status(404).json({ error: "Player or team not found" });
    }

    if (team.budget < offer) {
      return res
        .status(400)
        .json({ error: "Insufficient budget for this transfer" });
    }

    await prisma.$transaction([
      prisma.player.update({
        where: { id: playerId },
        data: { teamId: newTeamId },
      }),
      prisma.team.update({
        where: { id: newTeamId },
        data: {
          budget: { decrement: offer },
        },
      }),
    ]);

    res.json({ message: "Transfer completed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transfer failed" });
  }
});

module.exports = router;