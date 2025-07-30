// Register custom Handlebars helpers
Handlebars.registerHelper("formatDate", function (date) {
    if (!date) return new Date().toLocaleDateString();
    return new Date(date).toLocaleDateString();
});

Handlebars.registerHelper("currency", function (amount) {
    if (!amount) return "$0.00";
    return "$" + parseFloat(amount).toFixed(2);
});

Handlebars.registerHelper("uppercase", function (str) {
    return str ? str.toUpperCase() : "";
});

Handlebars.registerHelper("multiply", function (a, b) {
    return (a || 0) * (b || 0);
});

let activeTab = "template";

function switchTab(tabName) {
    document
        .querySelectorAll(".tab")
        .forEach((tab) => tab.classList.remove("active"));
    document
        .querySelectorAll(".tab-pane")
        .forEach((pane) => pane.classList.remove("active"));

    event.target.classList.add("active");
    document.getElementById(tabName + "-tab").classList.add("active");

    activeTab = tabName;
}

function loadTemplate() {
    const select = document.getElementById("templateSelect");
    const template = templates[select.value] || "";
    document.getElementById("templateEditor").value = template;
    updatePreview();
}

function getFormData() {
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        company: document.getElementById("company").value,
        position: document.getElementById("position").value,
        today: new Date().toISOString(),
        date: new Date().toISOString(),
        skills: document
            .getElementById("skills")
            .value.split("\n")
            .filter((skill) => skill.trim()),
    };

    const customData = document.getElementById("customData").value.trim();
    if (customData) {
        try {
            const parsed = JSON.parse(customData);
            Object.assign(formData, parsed);
        } catch (e) {
            console.warn("Invalid JSON in custom data:", e.message);
        }
    }

    return formData;
}

function updatePreview() {
    const templateSource = document.getElementById("templateEditor").value;
    const data = getFormData();
    const preview = document.getElementById("preview");
    const errorContainer = document.getElementById("errorContainer");

    errorContainer.innerHTML = "";

    if (!templateSource.trim()) {
        preview.innerHTML =
            '<p style="color: #6b7280; font-style: italic;">Enter a template to see the preview...</p>';
        updateWordCount("");
        return;
    }

    try {
        const template = Handlebars.compile(templateSource);

        const result = template(data);

        let htmlResult = result
            .replace(/^# (.*$)/gm, "<h1>$1</h1>")
            .replace(/^## (.*$)/gm, "<h2>$1</h2>")
            .replace(/^### (.*$)/gm, "<h3>$1</h3>")
            .replace(/^\*\*(.*?)\*\*/gm, "<strong>$1</strong>")
            .replace(/^\- (.*$)/gm, "<li>$1</li>")
            .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
            .replace(/\n\n/g, "</p><p>")
            .replace(/^(.*)$/gm, function (match) {
                if (match.match(/^<[h1-6]|<ul|<li|<strong/)) return match;
                if (match.trim() === "") return "";
                return match;
            });

        // Wrap in paragraphs
        if (htmlResult && !htmlResult.match(/^<[h1-6]|<ul/)) {
            htmlResult = "<p>" + htmlResult + "</p>";
        }

        preview.innerHTML =
            htmlResult ||
            '<p style="color: #6b7280; font-style: italic;">No content generated</p>';
        updateWordCount(result);
    } catch (error) {
        errorContainer.innerHTML = `<div class="error">Template Error: ${error.message}</div>`;
        preview.innerHTML =
            '<p style="color: #ef4444;">Template compilation failed. Check the error above.</p>';
        updateWordCount("");
    }
}

// Update word count
function updateWordCount(text) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById("wordCount").textContent = `${words} words`;
}

// Export document
function exportDocument() {
    const preview = document.getElementById("preview");
    const content = preview.innerHTML;

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
        h1, h2, h3 { color: #1f2937; margin-bottom: 1rem; }
        p { margin-bottom: 1rem; }
        ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
}

// Clear all data
function clearAll() {
    if (confirm("Are you sure you want to clear all data?")) {
        document.getElementById("templateEditor").value = "";
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("company").value = "";
        document.getElementById("position").value = "";
        document.getElementById("skills").value = "";
        document.getElementById("customData").value = "";
        document.getElementById("templateSelect").value = "blank";
        updatePreview();
    }
}

// Set up event listeners
document
    .getElementById("templateEditor")
    .addEventListener("input", updatePreview);

// Initialize with sample data
document.addEventListener("DOMContentLoaded", function () {
    // Sample data
    document.getElementById("name").value = "John Doe";
    document.getElementById("email").value = "john.doe@example.com";
    document.getElementById("phone").value = "+1 (555) 123-4567";
    document.getElementById("company").value = "Tech Innovations Inc.";
    document.getElementById("position").value = "Senior Developer";
    document.getElementById("skills").value =
        "JavaScript\nReact\nNode.js\nPython\nSQL";

    // Load default template
    loadTemplate();
});
