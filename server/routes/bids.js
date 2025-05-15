const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

const { isAuthenticated } = require("../middleware/auth");

router.post("/", isAuthenticated, async (req, res) => {
  const { playerId, teamId, amount } = req.body;

  if (!playerId || !teamId || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const bid = await prisma.bid.create({
      data: {
        playerId,
        teamId,
        amount,
      },
    });

    res.status(201).json(bid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place bid" });
  }
});

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      include: {
        player: true,
        team: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bids" });
  }
});

router.patch("/:id/accept", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const bid = await prisma.bid.findUnique({
      where: { id: parseInt(id) },
      include: { player: true, team: true },
    });

    if (!bid || bid.status !== "pending") {
      return res
        .status(404)
        .json({ error: "Bid not found or already processed" });
    }

    if (bid.team.budget < bid.amount) {
      return res.status(400).json({ error: "Team has insufficient budget" });
    }

    await prisma.$transaction([
      prisma.player.update({
        where: { id: bid.playerId },
        data: { teamId: bid.teamId },
      }),
      prisma.team.update({
        where: { id: bid.teamId },
        data: { budget: { decrement: bid.amount } },
      }),
      prisma.bid.update({
        where: { id: bid.id },
        data: { status: "accepted" },
      }),
      prisma.bid.updateMany({
        where: {
          playerId: bid.playerId,
          id: { not: bid.id },
          status: "pending",
        },
        data: { status: "rejected" },
      }),
    ]);

    res.json({ message: "Bid accepted and player transferred" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to accept bid" });
  }
});

router.patch("/:id/reject", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const bid = await prisma.bid.findUnique({
      where: { id: parseInt(id) },
    });

    if (!bid || bid.status !== "pending") {
      return res
        .status(404)
        .json({ error: "Bid not found or already processed" });
    }

    const updated = await prisma.bid.update({
      where: { id: parseInt(id) },
      data: { status: "rejected" },
    });

    res.json({ message: "Bid rejected successfully", bid: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject bid" });
  }
});

router.get("/player/:playerId", isAuthenticated, async (req, res) => {
  const { playerId } = req.params;

  try {
    const bids = await prisma.bid.findMany({
      where: { playerId: parseInt(playerId) },
      include: { team: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bids for player" });
  }
});

module.exports = router;
