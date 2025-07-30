const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handlebars setup
app.engine(
    "handlebars",
    engine({
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, "views/layouts"),
    })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
    res.render("index", {
        title: "Email Template Builder",
    });
});

// API endpoint to save template
app.post("/api/save-template", (req, res) => {
    const { templateData } = req.body;
    const fileName = `template_${Date.now()}.json`;
    const filePath = path.join(__dirname, "templates", fileName);

    // Create templates directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, "templates"))) {
        console.log("making directory");
        fs.mkdirSync(path.join(__dirname, "templates"));
    }

    fs.writeFileSync(filePath, JSON.stringify(templateData, null, 2));

    res.json({
        success: true,
        message: "Template saved successfully",
        fileName: fileName,
    });
});

// API endpoint to load template
app.get("/api/load-template/:filename", (req, res) => {
    const filePath = path.join(__dirname, "templates", req.params.filename);

    if (fs.existsSync(filePath)) {
        const templateData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        res.json(templateData);
    } else {
        res.status(404).json({ error: "Template not found" });
    }
});

// API endpoint to get all templates
app.get("/api/templates", (req, res) => {
    const templatesDir = path.join(__dirname, "templates");

    if (!fs.existsSync(templatesDir)) {
        return res.json([]);
    }

    const files = fs
        .readdirSync(templatesDir)
        .filter((file) => file.endsWith(".json"))
        .map((file) => ({
            name: file,
            created: fs.statSync(path.join(templatesDir, file)).mtime,
        }));

    res.json(files);
});

// server.js (or app.js)
app.get("/api/user-data", (req, res) => {
    res.render("form");
});

app.post("/api/save-user-data", (req, res) => {
    const filePath = path.join(__dirname, "public/js", 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));

     res.json({
        success: true,
        message: "Template saved successfully",
        data:req.body
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
