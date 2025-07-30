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
