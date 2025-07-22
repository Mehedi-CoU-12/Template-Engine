import express from "express";

const app = express();
const PORT = 5000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());

app.get("/", (req, res) => {
    const user = [
        {
            name: "mehedi",
            age: 24,
            varsity: "cou",
        },
        {
            name: "sumon",
            age: 24,
            varsity: "iu",
        },
        {
            name: "rajon",
            age: 24,
            varsity: "sec",
        },
        {
            name: "bristi",
            age: 24,
            varsity: "cou",
        },
    ];

    return res.render("userData", { user });
});

app.listen(PORT, () => {
    console.log(`server running on: http://locathost:${PORT}`);
});
