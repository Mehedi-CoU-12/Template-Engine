class EmailTemplateBuilder {
    constructor() {
        this.elements = [];
        this.selectedElement = null;
        this.elementCounter = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateJSON();
    }

    bindEvents() {
        // Tool buttons
        document
            .getElementById("add-text")
            .addEventListener("click", () => this.addElement("text"));
        document
            .getElementById("add-image")
            .addEventListener("click", () => this.addElement("image"));
        document
            .getElementById("add-button")
            .addEventListener("click", () => this.addElement("button"));

        // Action buttons
        document
            .getElementById("save-template")
            .addEventListener("click", () => this.saveTemplate());
        document
            .getElementById("load-template")
            .addEventListener("click", () => this.showLoadModal());
        document
            .getElementById("copy-json")
            .addEventListener("click", () => this.copyJSON());
        document
            .getElementById("user-button")
            .addEventListener("click", () => this.getUserData());

        // Canvas click to deselect
        document.getElementById("canvas").addEventListener("click", (e) => {
            if (e.target.id === "canvas") {
                this.selectElement(null);
            }
        });
    }

    addElement(type) {
        const elementId = `element_${++this.elementCounter}`;
        const element = {
            id: elementId,
            type: type,
            properties: this.getDefaultProperties(type),
        };

        this.elements.push(element);
        this.renderCanvas();
        this.selectElement(elementId);
        this.updateJSON();
    }

    getDefaultProperties(type) {
        switch (type) {
            case "text":
                return {
                    content: "Your text here",
                    fontSize: 16,
                    color: "#000000",
                    fontWeight: "normal",
                    textAlign: "left",
                };
            case "image":
                return {
                    src: "https://via.placeholder.com/300x150",
                    alt: "Image",
                };
            case "button":
                return {
                    text: "Click me",
                    backgroundColor: "#007bff",
                    color: "#ffffff",
                    href: "#",
                };
            default:
                return {};
        }
    }

    renderCanvas() {
        const canvas = document.getElementById("canvas");
        canvas.innerHTML = "";

        if (this.elements.length === 0) {
            canvas.innerHTML =
                '<div class="empty-state"><p>Click the buttons above to add elements</p></div>';
            return;
        }

        this.elements.forEach((element) => {
            const elementDiv = this.createElementDiv(element);
            canvas.appendChild(elementDiv);
        });
    }

    createElementDiv(element) {
        const elementDiv = document.createElement("div");
        elementDiv.className = `element ${element.type}-element`;
        elementDiv.id = element.id;

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "×";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            this.deleteElement(element.id);
        };
        elementDiv.appendChild(deleteBtn);

        // Add content
        const contentDiv = this.createContentDiv(element);
        elementDiv.appendChild(contentDiv);

        // Add click event
        elementDiv.onclick = (e) => {
            e.stopPropagation();
            this.selectElement(element.id);
        };

        return elementDiv;
    }

    createContentDiv(element) {
        const contentDiv = document.createElement("div");
        contentDiv.className = "element-content";

        switch (element.type) {
            case "text":
                contentDiv.innerHTML = element.properties.content;
                contentDiv.style.cssText = `
                    font-size: ${element.properties.fontSize}px;
                    color: ${element.properties.color};
                    font-weight: ${element.properties.fontWeight};
                    text-align: ${element.properties.textAlign};
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 4px;
                    min-height: 40px;
                `;
                break;

            case "image":
                const img = document.createElement("img");
                img.src = element.properties.src;
                img.alt = element.properties.alt;
                img.style.cssText =
                    "width: 100%; max-width: 80px; height: 80px; border-radius: 4px;";
                contentDiv.appendChild(img);
                break;

            case "button":
                const button = document.createElement("button");
                button.textContent = element.properties.text;
                button.style.cssText = `
                    background-color: ${element.properties.backgroundColor};
                    color: ${element.properties.color};
                    border: none;
                    border-radius: 4px;
                    padding: 12px 24px;
                    font-size: 16px;
                    cursor: pointer;
                    height: 40px;
                    width: 120px;
                `;
                contentDiv.appendChild(button);
                break;
        }

        return contentDiv;
    }

    selectElement(elementId) {
        // Remove previous selection
        document.querySelectorAll(".element").forEach((el) => {
            el.classList.remove("selected");
        });

        this.selectedElement = elementId;

        if (elementId) {
            document.getElementById(elementId).classList.add("selected");
            this.showProperties(elementId);
        } else {
            this.hideProperties();
        }
    }

    showProperties(elementId) {
        const element = this.elements.find((el) => el.id === elementId);
        const propertiesContent = document.getElementById("properties-content");

        let html = `<h3>${
            element.type.charAt(0).toUpperCase() + element.type.slice(1)
        } Properties</h3>`;

        switch (element.type) {
            case "text":
                html += `
                    <div class="property-group">
                        <label>Text Content</label>
                        <textarea rows="3" onchange="builder.updateProperty('${elementId}', 'content', this.value)">${
                    element.properties.content
                }</textarea>
                    </div>
                    <div class="property-group">
                        <label>Font Size</label>
                        <input type="number" value="${
                            element.properties.fontSize
                        }" onchange="builder.updateProperty('${elementId}', 'fontSize', this.value)">
                    </div>
                    <div class="property-group">
                        <label>Color</label>
                        <input type="color" value="${
                            element.properties.color
                        }" onchange="builder.updateProperty('${elementId}', 'color', this.value)">
                    </div>
                    <div class="property-group">
                        <label>Text Align</label>
                        <select onchange="builder.updateProperty('${elementId}', 'textAlign', this.value)">
                            <option value="left" ${
                                element.properties.textAlign === "left"
                                    ? "selected"
                                    : ""
                            }>Left</option>
                            <option value="center" ${
                                element.properties.textAlign === "center"
                                    ? "selected"
                                    : ""
                            }>Center</option>
                            <option value="right" ${
                                element.properties.textAlign === "right"
                                    ? "selected"
                                    : ""
                            }>Right</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label>Font Weight</label>
                        <select onchange="builder.updateProperty('${elementId}', 'fontWeight', this.value)">
                            <option value="normal" ${
                                element.properties.fontWeight === "normal"
                                    ? "selected"
                                    : ""
                            }>Normal</option>
                            <option value="bold" ${
                                element.properties.fontWeight === "bold"
                                    ? "selected"
                                    : ""
                            }>Bold</option>
                        </select>
                    </div>
                `;
                break;

            case "image":
                html += `
                    <div class="property-group">
                        <label>Image URL</label>
                        <input type="url" value="${element.properties.src}" onchange="builder.updateProperty('${elementId}', 'src', this.value)">
                    </div>
                    <div class="property-group">
                        <label>Alt Text</label>
                        <input type="text" value="${element.properties.alt}" onchange="builder.updateProperty('${elementId}', 'alt', this.value)">
                    </div>
                `;
                break;

            case "button":
                html += `
                    <div class="property-group">
                        <label>Button Text</label>
                        <input type="text" value="${element.properties.text}" onchange="builder.updateProperty('${elementId}', 'text', this.value)">
                    </div>
                    <div class="property-group">
                        <label>Background Color</label>
                        <input type="color" value="${element.properties.backgroundColor}" onchange="builder.updateProperty('${elementId}', 'backgroundColor', this.value)">
                    </div>
                    <div class="property-group">
                        <label>Text Color</label>
                        <input type="color" value="${element.properties.color}" onchange="builder.updateProperty('${elementId}', 'color', this.value)">
                    </div>
                    <div class="property-group">
                        <label>Link URL</label>
                        <input type="url" value="${element.properties.href}" onchange="builder.updateProperty('${elementId}', 'href', this.value)">
                    </div>
                `;
                break;
        }

        propertiesContent.innerHTML = html;
    }

    hideProperties() {
        document.getElementById("properties-content").innerHTML =
            "<p>Select an element to edit its properties</p>";
    }

    template(value) {
        return fetch("/js/data.json")
            .then((res) => res.json())
            .then((data) => {
                const tempData = Handlebars.compile(value);
                return tempData(data);
            });
    }

    updateProperty(elementId, property, value) {
        const element = this.elements.find((el) => el.id === elementId);

        this.template(value).then((result) => {
            element.properties[property] = result;
            this.renderCanvas();
            this.selectElement(elementId); // Keep element selected
            this.updateJSON();
        });
    }

    deleteElement(elementId) {
        this.elements = this.elements.filter((el) => el.id !== elementId);
        this.renderCanvas();

        if (this.selectedElement === elementId) {
            this.selectElement(null);
        }

        this.updateJSON();
    }

    updateJSON() {
        const jsonOutput = {
            template: {
                name: "Email Template",
                created: new Date().toISOString(),
                elements: this.elements.map((el, index) => ({
                    id: el.id,
                    type: el.type,
                    order: index,
                    properties: el.properties,
                })),
            },
        };

        document.getElementById("json-output").textContent = JSON.stringify(
            jsonOutput,
            null,
            2
        );
    }

    async saveTemplate() {
        const templateData = {
            template: {
                name: "Email Template",
                created: new Date().toISOString(),
                elements: this.elements.map((el, index) => ({
                    id: el.id,
                    type: el.type,
                    order: index,
                    properties: el.properties,
                })),
            },
        };

        try {
            const response = await fetch("/api/save-template", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templateData }),
            });

            const result = await response.json();
            if (result.success) {
                alert("Template saved successfully!");
            }
        } catch (error) {
            console.error("Error saving template:", error);
            alert("Error saving template");
        }
    }

    async showLoadModal() {
        try {
            const response = await fetch("/api/templates");
            const templates = await response.json();
            const templateList = document.getElementById("template-list");

            templateList.innerHTML =
                templates.length === 0
                    ? "<p>No saved templates found</p>"
                    : templates
                          .map(
                              (template) => `
                    <div class="template-item" onclick="builder.loadTemplate('${
                        template.name
                    }'); builder.closeModal();">
                        <strong>${template.name}</strong><br>
                        <small>Created: ${new Date(
                            template.created
                        ).toLocaleString()}</small>
                    </div>
                `
                          )
                          .join("");

            document.getElementById("load-modal").style.display = "block";
        } catch (error) {
            console.error("Error loading templates:", error);
        }
    }

    closeModal() {
        document.getElementById("load-modal").style.display = "none";
    }

    async loadTemplate(filename) {
        try {
            const response = await fetch(`/api/load-template/${filename}`);
            const templateData = await response.json();

            this.elements = [];

            if (templateData.template && templateData.template.elements) {
                this.elements = templateData.template.elements.map(
                    (elementData) => ({
                        id: elementData.id,
                        type: elementData.type,
                        properties: elementData.properties,
                    })
                );
            }

            this.renderCanvas();
            this.selectElement(null);
            this.updateJSON();
        } catch (error) {
            console.error("Error loading template:", error);
            alert("Error loading template");
        }
    }

    copyJSON() {
        const jsonText = document.getElementById("json-output").textContent;
        navigator.clipboard
            .writeText(jsonText)
            .then(() => alert("JSON copied to clipboard!"))
            .catch(() => alert("Failed to copy JSON to clipboard"));
    }

    async getUserData() {
        window.location.href = "/api/user-data";
    }
}

let builder;
builder = new EmailTemplateBuilder();

function closeModal() {
    builder.closeModal();
}


//form handlebars logic:
function updatePreview() {
        const userData = collectFormData();
        document.getElementById("data-preview").textContent =
        JSON.stringify(userData, null, 2);
    }

    function collectFormData() {
        const userData = {
            name: document.getElementById("name").value || "",
            email: document.getElementById("email").value || "",
            phone: document.getElementById("phone").value || "",
            company: document.getElementById("company").value || "",
            position: document.getElementById("position").value || "",
            skills: document
            .getElementById("skills")
            .value.split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        };

        return userData;
    }


    async function saveUserData() {

        const userData = collectFormData();

        await fetch("/api/save-user-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
    }