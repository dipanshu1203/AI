import { mkdir, readFile, writeFile } from "node:fs/promises";

const API_BASE = "https://api.jolpi.ca/ergast/f1";
const DATA_PATH = new URL("../projects/F1/data/prediction.json", import.meta.url);

const drivers = {
  "Kimi Antonelli": { team: "Mercedes", aliases: ["antonelli", "andant01"] },
  "George Russell": { team: "Mercedes", aliases: ["russell", "georus01"] },
  "Charles Leclerc": { team: "Ferrari", aliases: ["leclerc", "chalec01"] },
  "Lewis Hamilton": { team: "Ferrari", aliases: ["hamilton", "lewham01"] },
  "Lando Norris": { team: "McLaren", aliases: ["norris", "lannor01"] },
  "Oscar Piastri": { team: "McLaren", aliases: ["piastri", "oscpia01"] },
  "Max Verstappen": { team: "Red Bull Racing", aliases: ["max_verstappen", "verstappen", "maxver01"] }
};

const constructorAliases = {
  alpine: "Alpine",
  ferrari: "Ferrari",
  mclaren: "McLaren",
  mercedes: "Mercedes",
  red_bull: "Red Bull Racing",
  redbull: "Red Bull Racing",
  redbullracing: "Red Bull Racing"
};

async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} from ${path}`);
  }
  return response.json();
}

function raceDate(race) {
  return new Date(`${race.date}T${race.time || "00:00:00Z"}`);
}

function normalizeConstructor(id, name) {
  return constructorAliases[id] || constructorAliases[id?.replaceAll("-", "_")] || name;
}

function noteFor(driver, score, historicalWinner, winningTeam) {
  const data = drivers[driver];
  if (driver === historicalWinner) {
    return `${driver} gets the biggest track-history boost as last year's ${historicalWinner ? "race" : "track"} winner.`;
  }
  if (data.team === winningTeam) {
    return `${driver} benefits from ${winningTeam}'s win at this track last year.`;
  }
  if (score.teamForm >= 60) {
    return `${data.team} has the strongest current team form, so ${driver} stays high in the model.`;
  }
  return `${driver} needs ${data.team} to outperform its current team-form score.`;
}

async function buildPrediction() {
  const [scheduleData, constructorData] = await Promise.all([
    getJson("/current.json?limit=100"),
    getJson("/current/constructorStandings.json")
  ]);

  const races = scheduleData.MRData.RaceTable.Races;
  const now = new Date();
  const nextRace = races.find((race) => raceDate(race) >= now) || races.at(-1);
  const season = Number(scheduleData.MRData.RaceTable.season);
  const previousSeason = season - 1;

  const standingsList = constructorData.MRData.StandingsTable.StandingsLists.at(0);
  const constructors = standingsList?.ConstructorStandings || [];
  const maxPoints = Math.max(...constructors.map((item) => Number(item.points)), 1);
  const teamForm = Object.fromEntries(
    constructors.map((item) => {
      const teamName = normalizeConstructor(item.Constructor.constructorId, item.Constructor.name);
      return [teamName, Math.round((Number(item.points) / maxPoints) * 70)];
    })
  );

  const lastSeasonSchedule = await getJson(`/${previousSeason}.json?limit=100`);
  const matchingRace = lastSeasonSchedule.MRData.RaceTable.Races.find(
    (race) => race.Circuit.circuitId === nextRace.Circuit.circuitId
  );

  let historicalWinner = "";
  let winningTeam = "";

  if (matchingRace) {
    const resultsData = await getJson(`/${previousSeason}/${matchingRace.round}/results/1.json`);
    const result = resultsData.MRData.RaceTable.Races.at(0)?.Results?.at(0);
    if (result) {
      historicalWinner = `${result.Driver.givenName} ${result.Driver.familyName}`;
      winningTeam = normalizeConstructor(result.Constructor.constructorId, result.Constructor.name);
    }
  }

  const model = {};
  for (const [driver, data] of Object.entries(drivers)) {
    const trackHistory = driver === historicalWinner ? 30 : data.team === winningTeam ? 18 : 0;
    const score = {
      teamForm: teamForm[data.team] || 0,
      trackHistory
    };
    model[driver] = {
      ...score,
      note: noteFor(driver, score, historicalWinner, winningTeam)
    };
  }

  const sortedTeams = Object.entries(teamForm).sort((a, b) => b[1] - a[1]);

  return {
    updatedAt: new Date().toISOString(),
    source: "Jolpica-F1 API",
    nextRace: nextRace.raceName,
    trackHistoryLabel: historicalWinner
      ? `${previousSeason} ${nextRace.raceName}: ${historicalWinner} · ${winningTeam}`
      : `${previousSeason} ${nextRace.raceName}: no prior result found`,
    teamFormLabel: `Current team form: ${sortedTeams[0]?.[0] || "unknown"} P1`,
    drivers: model
  };
}

try {
  const prediction = await buildPrediction();
  await mkdir(new URL("../projects/F1/data/", import.meta.url), { recursive: true });
  await writeFile(DATA_PATH, `${JSON.stringify(prediction, null, 2)}\n`);
  console.log(`Updated ${DATA_PATH.pathname}`);
} catch (error) {
  console.warn(`Prediction refresh failed: ${error.message}`);
  console.warn("Keeping existing prediction data.");
  await readFile(DATA_PATH, "utf8");
}
