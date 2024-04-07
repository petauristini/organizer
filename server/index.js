const keys = require("./keys");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const port = keys.nodePort || 5000;

console.log("Environment: ", keys.environment);

app.use(cors());
app.use(bodyParser.json());

const { Pool } = require("pg");
const db = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

const createTable = async () => {
  await db.query(
    "CREATE TABLE IF NOT EXISTS todo (id SERIAL PRIMARY KEY, item TEXT);"
  );
};

createTable();

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/todo", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM todo");
    todo = response.rows;

    if (response) res.status(200).send(todo);
  } catch (error) {
    res.status(500).send("Error");
    console.log(error);
  }
});

app.post("/api/todo", async (req, res) => {
  try {
    const newToDo = req.body.item;
    await db.query("INSERT INTO todo(item) VALUES($1)", [newToDo]);
    res.status(200).send(newToDo);
  } catch (error) {
    res.status(500).send("Error");
    console.log(error);
  }
});

app.delete("/api/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM todo WHERE id = $1", [id]);
    res.status(200).send(`Deleted todo with id: ${id}`);
  } catch (error) {
    res.status(500).send("Error");
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
