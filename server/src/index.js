import keys from "./keys.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pgk from "pg";
const { Pool } = pgk;
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

const app = express();
const port = keys.nodePort || 5000;
const saltRounds = keys.saltRounds || 10;

console.log("Environment: ", keys.environment);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: keys.sessionSecret || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      mayAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const db = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

const createTables = async () => {
  await db.query(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL UNIQUE, email VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL);"
  );
  await db.query(
    "CREATE TABLE IF NOT EXISTS todo (id SERIAL PRIMARY KEY, item VARCHAR(50) NOT NULL, type VARCHAR(10) NOT NULL, user_id INTEGER REFERENCES users(id) NOT NULL)"
  );
};

createTables();

const getUserByEmail = async (email) => {
  try {
    const response = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    return response.rows[0];
  } catch (error) {
    console.log(error);
  }
}

const getUserByUsername = async (username) => {
  try {
    const response = await db.query("SELECT * FROM users WHERE username=$1", [username]);
    return response.rows[0];
  } catch (error) {
    console.log(error);
  }
}

app.get("/api", (req, res) => {
  res.send("Hello World!, This is the organizer!");
});

app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send(req.user);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/api/todo", async (req, res) => {
  if (req.isAuthenticated()) {
    getUserByEmail(req.user.email).then(async (user) => {
      try {
        const response = await db.query("SELECT * FROM todo WHERE user_id=$1 AND type=$2", [user.id, req.query.type]);
        const todo = response.rows;
        if (response) res.status(200).send(todo);
      } catch (error) {
        res.status(500).send("Error");
        console.log(error);
      }
    })
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.post("/api/todo", async (req, res) => {
  if (req.isAuthenticated()) {
    getUserByEmail(req.user.email).then(async (user) => {
      try {
        const newToDo = req.body.item;
        await db.query("INSERT INTO todo (item, type, user_id) VALUES($1, $2, $3)", [newToDo, req.body.type, user.id]);
        console.log(newToDo);
        res.status(200).send(newToDo);
      } catch (error) {
        res.status(500).send("Error");
        console.log(error);
      }
    })
  } else {
    res.status(401).send("Unauthorized");
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

app.post("/api/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    res.status(400).send("Missing required fields");
    return;
  }

  console.log("User: ", username, "Email: ", email, "Password: ", password);

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.status(409).send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      const hash = await bcrypt.hash(password, saltRounds);
      console.log("Hashed Password:", hash);
      const result = await db.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hash]
      );
      const user = result.rows[0];
      console.log("User After registration", user);
      req.login(user, (err) => {
        if (err) {
          console.error("Error logging in user:", err);
          res.status(500).send("Error logging in user");
        } else {
          res.status(200).send("User registered and logged in successfully");
        }
      });
    }
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Error registering user");
  }
});


app.post(
  "/api/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

passport.use(
  new Strategy(async function verify(username, password, cb) {
    console.log(username);

    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, result) => {
          if (err) {
            return cb(err);
          } else {
            if (result) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
