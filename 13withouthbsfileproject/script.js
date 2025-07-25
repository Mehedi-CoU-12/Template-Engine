// Wait for the DOM to be ready (optional but often a good idea)
document.addEventListener("DOMContentLoaded", () => {
    renderBlog();
});

async function renderBlog() {
    try {
        // Fetch blog data and templates in parallel
        const [data, templates] = await Promise.all([
            fetch("data.json").then((res) => res.json()),
            fetch("templates.json").then((res) => res.json()),
        ]);

        // Register partials from the templates JSON
        Object.keys(templates).forEach((key) => {
            if (key !== "main") {
                Handlebars.registerPartial(key, templates[key]);
            }
        });

        // Compile the main template
        const mainTemplate = Handlebars.compile(templates.main);
        const html = mainTemplate(data);

        // Insert the resulting HTML into the page
        document.getElementById("app").innerHTML = html;

    } catch (error) {
        console.error("Error rendering the blog:", error);
    }
}
