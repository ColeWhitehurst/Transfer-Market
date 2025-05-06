const fetch = require('node-fetch');

const API_KEY = '1';
const leagues = [
  'English Premier League',
  'Spanish La Liga',
  'German Bundesliga',
  'Italian Serie A',
  'French Ligue 1',
];

async function testLeagueURLs() {
  for (const league of leagues) {
    const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/search_all_teams.php?l=${encodeURIComponent(league)}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      console.log(`✅ ${league}: ${json.teams ? json.teams.length : 0} teams`);
    } catch (e) {
      console.error(`❌ Failed to fetch for ${league}:`, e.message);
    }
  }
}

testLeagueURLs();
