import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const baseURL = "https://openlibrary.org/search.json";

// Database configuration
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: "root",
    port: 5432,
});

db.connect();

// Get the current file directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine
app.set("view engine", "ejs");

// Home page - list all books
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY id ASC;");
    console.log(result.rows);
    
    res.render("index", { 
      title: "BookVerse",
      books: result.rows 
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Something went wrong.");
  }
});

// Add a new book
app.post("/add", async (req, res) => {
  const searchTitle = req.body.title;

  try {
    const response = await axios.get(baseURL, {
      params: { title: searchTitle }
    });
    const books = response.data.docs;
    const matchedBook = books.find(book => book.title.toLowerCase().includes(searchTitle.toLowerCase()));
    console.log(matchedBook);
    
    const cover_id = matchedBook ? matchedBook.cover_i : null;
    const authorFromAPI = matchedBook && matchedBook.author_name ? matchedBook.author_name[0] : null;

    const { title, author, rating, notes, date_read } = req.body;
    const authorFinal = author || authorFromAPI;
const formattedDate = date_read === "" ? null : date_read;

await db.query(
  "INSERT INTO books (title, author, rating, notes, date_read, cover_id) VALUES ($1, $2, $3, $4, $5, $6)",
  [title, authorFinal, rating, notes, formattedDate, cover_id]
);


    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit a book form
app.get("/edit/:id", async (req, res) => {
  const bookId = req.params.id;
  
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);
    const book = result.rows[0];

    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render("edit", { 
      title: `Edit - ${book.title}`,
      book 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving book for editing");
  }
});

// Update a book
app.post("/edit/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, author, rating, notes, date_read } = req.body;

  const formattedDate = date_read === "" ? null : date_read;

  let cover_id = null;
  try {
    const response = await axios.get(baseURL, {
      params: { title: title }
    });
    const books = response.data.docs;
    const matchedBook = books.find(book => book.title.toLowerCase().includes(title.toLowerCase()));
    if (matchedBook && matchedBook.cover_i) {
      cover_id = matchedBook.cover_i;
    }
  } catch (apiError) {
    console.error("OpenLibrary API error:", apiError.message);
  }

  try {
    await db.query(
      "UPDATE books SET title = $1, author = $2, rating = $3, notes = $4, date_read = $5, cover_id = $6 WHERE id = $7",
      [title, author, rating, notes, formattedDate, cover_id, bookId]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating book");
  }
});

app.get("/mybooks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books WHERE favorite = true ORDER BY id ASC;");
    res.render("mybooks.ejs", { 
      title: "My Favorite Books",
      books: result.rows 
    });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).send("Something went wrong.");
  }
});


// Toggle favorite status
app.post("/favorite/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    // First get current favorite status
    const result = await db.query("SELECT favorite FROM books WHERE id = $1", [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }

    const currentFavorite = result.rows[0].favorite;
    // Toggle favorite status
    const newFavorite = !currentFavorite;

    // Update the book's favorite field
    await db.query("UPDATE books SET favorite = $1 WHERE id = $2", [newFavorite, bookId]);

    res.redirect("/");  // or wherever you want to redirect after toggling
  } catch (err) {
    console.error("Error toggling favorite:", err);
    res.status(500).send("Server error");
  }
});


app.get("/about", async (req, res)=> {
  res.render("about",
    {
      title: `About`
    }
  );
});

// Delete a book
app.post("/delete/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting the book.");
  }
});

// Stats page
app.get("/stats", async (req, res) => {
  try {
    const booksCount = await db.query("SELECT COUNT(*) FROM books");
    const avgRating = await db.query("SELECT AVG(rating) FROM books");
    const topRated = await db.query("SELECT * FROM books ORDER BY rating DESC LIMIT 3");
    
    res.render("stats", {
      title: "Reading Stats",
      stats: {
        total: booksCount.rows[0].count,
        average: parseFloat(avgRating.rows[0].avg).toFixed(1),
        topBooks: topRated.rows
      }
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).send("Something went wrong.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});