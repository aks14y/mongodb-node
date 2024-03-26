const express = require("express");

const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// init app
const app = express();
app.use(express.json());

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3001, () => {
      console.log("app listening on port 3001");
    });
    db = getDb();
  }
});

// routes

app.get("/books", (req, res) => {
  const page = req.query.page || 0;
  const booksPerPage = 2;
  let books = [];
  db.collection("books")
    .find()
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => res.status(200).json(books))
    .catch(() => res.status(500).json({ error: "Could not fetch" }));
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => res.status(200).json(doc))
      .catch((err) =>
        res.status(500).json({ error: "Could not fetch the requested id." })
      );
  } else {
    res.status(500).json({ error: "Wrong valid ID." });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) =>
      res.status(500).json({ error: "Could not fetch the requested id." })
    );
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) =>
        res.status(500).json({ error: "Could not delete the requested book." })
      );
  } else {
    res.status(500).json({ error: "Wrong valid ID." });
  }
});

app.patch("/books/:id", (req, res) => {
  const updatedBook = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedBook })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) =>
        res.status(500).json({ error: "Could not update the requested book." })
      );
  } else {
    res.status(500).json({ error: "Wrong valid ID." });
  }
});
