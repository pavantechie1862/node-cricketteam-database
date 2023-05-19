const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const app = express();
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Initialized Database and server");
      console.log("Application is listening to http://localhost/3000");
    });
  } catch (e) {
    console.log("Failed to initialize DB and Server");
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const query = `
    select * from cricket_team`;

  const dbResponse = await db.all(query);
  response.send(dbResponse);
});

app.post("/players/", async (request, response) => {
  const player = request.body;
  const { playerName, jerseyNumber, role } = player;

  const query = `
    insert into cricket_team (player_name,jersey_number,role)
    values
    (
      '${playerName}','${jerseyNumber}','${role}'
    )
    `;

  const dbResponse = await db.run(query);
  response.send("Player Added to Team");
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const query = `
    select * from cricket_team where player_id = ${playerId}
    
    `;

  const dbResponse = await db.get(query);
  response.send(dbResponse);
});

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const newData = request.body;
  const { jerseyNumber, playerName, role } = newData;
  const query = `
    update cricket_team 
    set 
    player_name = '${playerName}',
    jersey_number = '${jerseyNumber}',
    role = '${role}'
    
    `;

  const dbResponse = await db.run(query);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const query = `
    delete from cricket_team where player_id = ${playerId}`;
  await db.run(query);
  response.send("Player Removed");
});
