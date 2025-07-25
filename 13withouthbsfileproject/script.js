async function renderBlog() {
    const [data, templates] = await Promise.all([
        fetch("data.json").then((res) => res.json()),
        fetch("templates.json").then((res) => res.json()),
    ]);
    
    //making resuable components
    Object.keys(templates).forEach((key) => {
        if (key !== "main") {
            Handlebars.registerPartial(key, templates[key]);
        }
    });
    
    //compile
    const mainTemplate = Handlebars.compile(templates.main);
    const html = mainTemplate(data);
    
    //inject the string 
    document.getElementById("app").innerHTML = html;
}

renderBlog();