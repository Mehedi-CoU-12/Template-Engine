const express = require("express");
const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const templates = JSON.parse(
    fs.readFileSync(path.join(__dirname, "templates.json"), "utf8")
);

const layoutTpl = Handlebars.compile(templates.layouts.main);
const viewTpls = {
    index: Handlebars.compile(templates.views.index),
    form: Handlebars.compile(templates.views.form),
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//save template
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

// api endpoint to load template
app.get("/api/load-template/:filename", (req, res) => {
    const filePath = path.join(__dirname, "templates", req.params.filename);

    if (fs.existsSync(filePath)) {
        const templateData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        res.json(templateData);
    } else {
        res.status(404).json({ error: "Template not found" });
    }
});

//api endpoint to get all templates
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

//serve index file
app.get("/", (req, res) => {
    const body = viewTpls.index({ title: "Email Template Builder" });
    res.send(layoutTpl({ title: "Email Template Builder", body }));
});

//serve form file
app.get("/api/user-data", (req, res) => {
    const body = viewTpls.form({});
    res.send(layoutTpl({ title: "User Data Form", body }));
});

//save form data
app.post("/api/save-user-data", (req, res) => {
    const filePath = path.join(__dirname, "public/js", "data.json");
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: "User data saved", data: req.body });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
