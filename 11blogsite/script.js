//make the data into an array
function fun(tempData, obj) {
    Handlebars.registerHelper("string_parser", (str, obj) => {
        let i = 0;
        let res = "";
        while (i < str.length) {
            if (str.startsWith("{{", i)) {
                const end = str.indexOf("}}", i);
                if (end != -1) {
                    const key = str.slice(i + 2, end);
                    res += obj[key] ?? "";
                    i = end + 2;
                } else i++;
            } else (res += str[i]), i++;
        }
        return res;
    });

    Handlebars.registerHelper("parser", (tempData, obj) => {
        let result = {};
        for (const key in tempData) {
            result[key] = Handlebars.helpers.string_parser(tempData[key], obj);
        }
        return result;
    });

    store_data = Handlebars.helpers.parser(tempData, obj);

    return store_data;
}

//formhandle
async function formHandler() {
    const [tempData, resultSrc, mainSrc, formSrc] = await Promise.all([
        fetch("template.json").then((res) => res.json()),
        fetch("templates/result.hbs").then((res) => res.text()),
        fetch("templates/main.hbs").then((res) => res.text()),
        fetch("templates/form.hbs").then((res) => res.text()),
    ]);

    Handlebars.registerPartial("form", formSrc);
    Handlebars.registerPartial("result", resultSrc);
    const template = Handlebars.compile(mainSrc);

    const obj = {
        name: "mehedi",
        topic: "mehedi",
        blog: "mehedi",
        created_time: "23",
    };

    const store_data = [];

    function formInputHandler() {
        const form = document.getElementById("blog-form");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const inputObj = {
                    name: formData.get("name"),
                    blog: formData.get("blog"),
                    topic: formData.get("topic"),
                    created_time: new Date(),
                };

                const v = fun(tempData, inputObj);
                
                store_data.push(v);

                render();
            });
        } else console.log("form nai😭");
    }

    function render() {
        const html = template(store_data);
        document.getElementById("show").innerHTML = html;

        formInputHandler();
    }

    render();
}
formHandler();
