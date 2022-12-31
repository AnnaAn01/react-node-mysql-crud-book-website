import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
// console.log(process.env.PASSWORD);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: "test",
});

// if there is a auth problem install myql2 instead of mysql, and import it above

// reaching the backend server
// whenever we visit the homepage of this backend server, we'll get req, then response after that,
app.get("/", (req, res) => {
  res.json("This is from the backend");
});

// express server middleware
// by default we cannot send any data to our express server, so this is to prevent this problem
// this allows us to send any json file using a client
app.use(express.json());
// middleware for cors
app.use(cors());

app.get("/books", (req, res) => {
  // we need an sql qury for this
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// create any book
app.post("/books", (req, res) => {
  const q = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been created successfully");
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been deleted successfully");
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been updated successfully");
  });
});

app.listen(8800, () => {
  console.log("Connected to backend!!");
});
