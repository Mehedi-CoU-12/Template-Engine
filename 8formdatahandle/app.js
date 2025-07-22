import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { userSchema } from "./validation/zod.js";
import Handlebars from "handlebars";
import { template } from "./data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const app = express();

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


//middlewares
app.use(bodyParser.urlencoded({ extended: true }));

//parse the data to show them into browser
Handlebars.registerHelper("recursiveObjectTree", (obj) => {
    if (typeof obj === "string" || typeof obj === "number") return obj;

    if (Array.isArray(obj)) {
        const items = obj
            .map((item) => {
                return `<li>${Handlebars.helpers.recursiveObjectTree(
                    item
                )}</li>`;
            })
            .join("");

        return `<ul>${items}</ul>`;
    }

    if (typeof obj === "object") {
        let result = `<ul>`;
        for (const key in obj) {
            result += `<li>${key}:${Handlebars.helpers.recursiveObjectTree(
                obj[key]
            )}</li>`;
        }

        result += "</ul>";

        return result;
    }
});

//if the user data is String
Handlebars.registerHelper("stringParser", (str, userData) => {
    let i = 0;
    let result = "";
    while (i < str.length) {
        if (str.startsWith("{{", i)) {
            let end = str.indexOf("}}", i);

            if (end != -1) {
                let key = str.slice(i + 2, end);
                result += userData[key];

                i = end + 2;
            } else i++;
        } else {
            result += str[i];
            i++;
        }
    }

    const numberResult = Number(result);

    if (isNaN(numberResult)) {
        return result;
    } else {
        return numberResult;
    }
});

//replace template's placeholder with user data
Handlebars.registerHelper("userDataParser", (template, userData) => {
    if (typeof template === "string")
        return Handlebars.helpers.stringParser(template, userData);

    if (Array.isArray(template)) {
        return template.map((value) =>
            Handlebars.helpers.userDataParser(value, userData)
        );
    }

    if (typeof template === "object") {
        let result = {};

        for (const key in template) {
            result[key] = Handlebars.helpers.userDataParser(
                template[key],
                userData
            );
        }

        return result;
    }

    // return template;
});

//header
Handlebars.registerPartial("header","<header>Header</header>")

//footer
Handlebars.registerPartial("footer", "<footer>© 2025</footer>");


app.get("/", (req, res) => {
    res.render("form");
});

app.post("/submit", (req, res) => {
    const userData = req.body;

    const data = Handlebars.helpers.userDataParser(template, userData);

    const result = userSchema.safeParse(data);

    if (!result.success)
        return res.send(
            "Invalid input: " + JSON.stringify(result.error.format())
        );

    return res.render("result", { user: result.data });
});

app.listen(PORT, () => {
    console.log(`server is running on PORT: http://localhost:${PORT}`);
});
