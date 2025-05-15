require('dotenv').config();
const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// const API_KEY = process.env.THESPORTSDB_API_KEY || '3';
const API_BASE = `https://www.thesportsdb.com/api/v1/json/3`;
const LEAGUES = [
  'English Premier League',
  'Spanish La Liga',
  'German Bundesliga',
  'Italian Serie A',
  'French Ligue 1',
];

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildTeamURL(leagueName) {
  return `${API_BASE}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`;
}

function buildPlayersURL(teamId) {
  return `${API_BASE}/lookup_all_players.php?id=${teamId}`;
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Node.js fetch)',
        'Accept': 'application/json',
      },
    });

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    if (!res.ok) {
      console.error(`❌ HTTP ${res.status} from ${url}`);
      console.error(text.slice(0, 300));
      throw new Error(`Failed request: ${res.status}`);
    }

    if (!contentType.includes('application/json')) {
      console.error(`❌ Unexpected content-type for ${url}: ${contentType}`);
      console.error(text.slice(0, 300));
      throw new Error(`Expected JSON but got something else.`);
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error(`❌ Failed to parse JSON from ${url}`);
      console.error(text.slice(0, 300));
      throw new Error('Invalid JSON');
    }
  } catch (err) {
    console.error(`🔥 Fetch error for ${url}: ${err.message}`);
    throw err;
  }
}

async function testLeagueURLs() {
  for (const league of LEAGUES) {
    const url = buildTeamURL(league);
    console.log(`🔍 Testing: ${url}`);
    try {
      const data = await fetchJSON(url);
      console.log(`✅ ${league}: ${data.teams ? data.teams.length : 0} teams`);
    } catch (e) {
      console.error(`❌ Error testing ${league}:`, e.message);
    }
  }
}

async function fetchTeams(leagueName) {
  const url = buildTeamURL(leagueName);
  const data = await fetchJSON(url);
  return data.teams || [];
}

async function fetchPlayers(teamId) {
  const url = buildPlayersURL(teamId);
  const data = await fetchJSON(url);
  return data.player || [];
}

function calculateAge(dateBorn) {
  if (!dateBorn) return null;
  const birthYear = new Date(dateBorn).getFullYear();
  return new Date().getFullYear() - birthYear;
}

async function main() {
  await testLeagueURLs();

  for (const league of LEAGUES) {
    console.log(`🌍 Seeding league: ${league}`);
    await delay(500);

    let teams;
    try {
      teams = await fetchTeams(league);
    } catch (err) {
      console.error(`❌ Failed to fetch teams for ${league}:`, err.message);
      continue;
    }

    if (!teams.length) {
      console.warn(`⚠️ No teams found for ${league}`);
      continue;
    }

    for (const team of teams) {
      if (!team.strTeam || !team.idTeam) {
        console.warn(`⏭️ Skipping team due to missing name or ID`, team);
        continue;
      }

      let createdTeam;
      try {
        createdTeam = await prisma.team.create({
          data: {
            name: team.strTeam,
            logoUrl: team.strTeamBadge,
            budget: Math.floor(Math.random() * 100_000_000) + 100_000_000,
            league,
          },
        });
      } catch (err) {
        console.error(`❌ Failed to create team ${team.strTeam}:`, err.message);
        continue;
      }

      let players = [];
      try {
        players = await fetchPlayers(team.idTeam);
      } catch (err) {
        console.error(`❌ Failed to fetch players for ${team.strTeam}:`, err.message);
        continue;
      }

      if (!players.length) {
        console.warn(`⚠️ No players found for ${team.strTeam}`);
        continue;
      }

      console.log(`⚽ Seeding ${players.length} players for ${team.strTeam}`);

      for (const player of players) {
        if (!player.strPlayer || !player.dateBorn) {
          console.warn(`⏭️ Skipping player due to missing name or DOB`, player.strPlayer);
          continue;
        }

        try {
          await prisma.player.create({
            data: {
              name: player.strPlayer,
              age: calculateAge(player.dateBorn),
              position: player.strPosition || null,
              nationality: player.strNationality || null,
              imageUrl: player.strCutout || null,
              marketValue: Math.floor(Math.random() * 50_000_000) + 5_000_000,
              teamId: createdTeam.id,
            },
          });
        } catch (err) {
          console.error(`❌ Failed to create player ${player.strPlayer}:`, err.message);
        }
      }

      await delay(300);
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((err) => {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });