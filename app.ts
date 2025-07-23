import express, { Request, Response } from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { userSchema } from "./validation/zod.js";
import Handlebars from "handlebars";
import { template } from "./data.js";
import { ZodError } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const app = express();

// Set up Handlebars engine
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, "views/layouts"),
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Recursive rendering helper
Handlebars.registerHelper("recursiveObjectTree", (obj: any): string => {
    if (typeof obj === "string" || typeof obj === "number") return String(obj);

    if (Array.isArray(obj)) {
        const items = obj
            .map((item) => `<li>${Handlebars.helpers.recursiveObjectTree(item)}</li>`)
            .join("");
        return `<ul>${items}</ul>`;
    }

    if (typeof obj === "object" && obj !== null) {
        let result = "<ul>";
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result += `<li>${key}: ${Handlebars.helpers.recursiveObjectTree(obj[key])}</li>`;
            }
        }
        result += "</ul>";
        return result;
    }

    return "";
});

// Replace `{{key}}` in strings with actual user data
Handlebars.registerHelper("stringParser", (str: string, userData: Record<string, any>): string | number => {
    let i = 0;
    let result = "";

    while (i < str.length) {
        if (str.startsWith("{{", i)) {
            const end = str.indexOf("}}", i);
            if (end !== -1) {
                const key = str.slice(i + 2, end).trim();
                result += userData[key] ?? "";
                i = end + 2;
            } else {
                i++;
            }
        } else {
            result += str[i];
            i++;
        }
    }

    const numberResult = Number(result);
    return isNaN(numberResult) ? result : numberResult;
});

// Recursively replace placeholders in entire object/array/string
Handlebars.registerHelper("userDataParser", function parse(
    template: any,
    userData: Record<string, any>
): any {
    if (typeof template === "string") {
        return Handlebars.helpers.stringParser(template, userData);
    }

    if (Array.isArray(template)) {
        return template.map((item) => parse(item, userData));
    }

    if (typeof template === "object" && template !== null) {
        const result: Record<string, any> = {};
        for (const key in template) {
            result[key] = parse(template[key], userData);
        }
        return result;
    }

    return template;
});

// Register partials
Handlebars.registerPartial("header", "<header>Header</header>");
Handlebars.registerPartial("footer", "<footer>© 2025</footer>");

// Routes
app.get("/", (_req: Request, res: Response) => {
    res.render("form");
});

app.post("/submit", (req: Request, res: Response) => {
    const userData = req.body;
    const parsedData = Handlebars.helpers.userDataParser(template, userData);

    const result = userSchema.safeParse(parsedData);

    if (!result.success) {
        const errorMessages = JSON.stringify(result.error.format(), null, 2);
        return res.send(`Invalid input:<pre>${errorMessages}</pre>`);
    }

    res.render("result", { user: result.data });
});

// Server start
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
