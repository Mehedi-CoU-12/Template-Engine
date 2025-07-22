import { cast } from "./data.js";

const div = document.getElementById("show");
const source = document.getElementById("source").innerHTML;
const template = Handlebars.compile(source);

const result = template(cast);

div.innerHTML = result;
