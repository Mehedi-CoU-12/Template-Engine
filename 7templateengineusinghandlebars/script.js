const data = {
    name: "Mehedi",
    age: 25,
    city: "Cumilla",
    contact: {
        email: "mehedi@gmail.com",
        phone: "01849",
        address: {
            street: "6 road surmagate",
            zip: "123",
        },
    },
    skills: ["JavaScript", "C++", "TypeScript"],
    education: {
        university: "CoU",
        degree: "BSc",
        year: "2025",
    },
};

// Register partial (recursive view)
const renderObjectTemplate = document.getElementById("render-object").innerHTML;
Handlebars.registerPartial("sumon", renderObjectTemplate);

// Register helper to detect object
Handlebars.registerHelper("isSumon", function (value) {
    return typeof value === "object" && !Array.isArray(value);
});

// Register helper to detect array
Handlebars.registerHelper("isMehedi", function (value) {
    return Array.isArray(value);
});

const source = document.getElementById("recursive-template").innerHTML;
const template = Handlebars.compile(source);
const resultHTML = template(data);
document.getElementById("output").innerHTML = resultHTML;
