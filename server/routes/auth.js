const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

router.post('/signup', async (req, res) => {
    const { username, password, teamId } = req.body;
  
    if (!username || !password || !teamId)
      return res.status(400).json({ error: 'Missing fields' });
  
    try {
      const hashed = await bcrypt.hash(password, 10);
      const manager = await prisma.manager.create({
        data: {
          username,
          password: hashed,
          teamId,
        },
      });

      const token = jwt.sign({ id: manager.id, teamId }, process.env.JWT_SECRET);
  
      res.json({ token, teamId, username });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Signup failed' });
    }
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    const manager = await prisma.manager.findUnique({ where: { username } });
    if (!manager) return res.status(404).json({ error: 'Manager not found' });
  
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
    const token = jwt.sign({ id: manager.id, teamId: manager.teamId }, process.env.JWT_SECRET);
    res.json({ token, teamId: manager.teamId, username });
  });

  module.exports = router;