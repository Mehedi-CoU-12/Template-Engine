import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Required for path resolving in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// Middleware
app.use(express.json());

// Route
app.get("/", (req, res) => {
    const data = {
        name: "rajon bro",
        age: 24,
        city: "sylhet",
    };

    return res.render("home", { data });
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
