import mysql from "mysql";
import express from "express";
import { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { log } from "console";
import dotenv from 'dotenv';
dotenv.config();


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
console.log(process.env.port);
const connection = mysql.createConnection({
  host: process.env.host, 
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});



app.get("/", (req, res) => {
  connection.query('SELECT roll_number, name, status FROM students', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
  
    // Render the EJS template with the fetched records
    res.render("index.ejs", { results });
  });
});



app.post("/submit", (req, res) => {
  const statusUpdates = req.body;
  Object.entries(statusUpdates).forEach(([name, status]) => {
    const query = `UPDATE students SET status = ? WHERE name = ?`;
    connection.query(query, [status, name], (err, results) => {
      if (err) {
        console.error('Error updating database:', err);
      }
    });
  });
  res.redirect("/");
});

  app.listen(3000 || process.env.port , () => {
    console.log(`Listening on port ${process.env.port}`);
  });
  










