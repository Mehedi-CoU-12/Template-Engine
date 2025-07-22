import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { cast } from "./script.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set Handlebars as the view engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Route
app.get("/", (req, res) => {
    res.render("home", cast);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
