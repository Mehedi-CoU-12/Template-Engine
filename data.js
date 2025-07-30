const templates = {
    layouts: {
        main: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
    <link rel="stylesheet" href="/css/styles.css" />
    <script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>
  </head>
  <body>
    {{{body}}}
    <script src="/js/app.js"></script>
  </body>
</html>`,
    },
    views: {
        index: `
<div class="container">

  <header class="toolbox">
    <h1>{{title}}</h1>
    <div class="tools">
      <button id="add-text" class="tool-btn"><span class="icon">📝</span>Text</button>
      <button id="add-image" class="tool-btn"><span class="icon">🖼️</span>Image</button>
      <button id="add-button" class="tool-btn"><span class="icon">🔘</span>Button</button>
      <button id="user-button" class="tool-btn">Take User Input</button>
    </div>
    <div class="actions">
      <button id="save-template" class="action-btn">💾 Save</button>
      <button id="load-template" class="action-btn">📁 Load</button>
      <button id="copy-json" class="action-btn">📋 Copy JSON</button>
    </div>
  </header>

  <main class="main-content">
    <section class="canvas-section">
      <h2>Live Preview</h2>
      <div id="canvas" class="canvas">
        <div class="empty-state"><p>Click the buttons above to add elements</p></div>
      </div>
    </section>

    <aside class="properties-panel">
      <h2>Properties</h2>
      <div id="properties-content" class="properties-content">
        <p>Select an element to edit its properties</p>
      </div>
    </aside>

    <aside class="json-panel">
      <h2>JSON Output</h2>
      <pre id="json-output" class="json-output">{}</pre>
    </aside>
  </main>

  <div id="load-modal" class="modal">
    <div class="modal-content">
      <h3>Load Template</h3>
      <div id="template-list"></div>
      <button onclick="closeModal()" class="close-btn">Close</button>
    </div>
  </div>
</div>`,

        form: `
<div class="form-container">
  <h1>User Data Form</h1>
  <p>Fill out the form below to save your data to the system.</p>

  <div id="data-tab" class="tab-pane">
    <div class="data-form">
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="name" placeholder="Your full name" oninput="updatePreview()" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" placeholder="your.email@example.com" oninput="updatePreview()" />
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="text" id="phone" placeholder="+1 (555) 123-4567" oninput="updatePreview()" />
      </div>
      <div class="form-group">
        <label>Company</label>
        <input type="text" id="company" placeholder="Your company name" oninput="updatePreview()" />
      </div>
      <div class="form-group">
        <label>Position</label>
        <input type="text" id="position" placeholder="Your job title" oninput="updatePreview()" />
      </div>
      <div class="form-group">
        <label>Skills (one per line)</label>
        <textarea id="skills" rows="4" placeholder="JavaScript&#10;React&#10;Node.js&#10;Python" oninput="updatePreview()"></textarea>
      </div>
    </div>

    <div class="button-group">
      <button onclick="saveUserData()" type="button" class="btn btn-primary">Save Data</button>
      <a href="/" class="btn btn-outline">Back to Template Builder</a>
    </div>

    <div id="success-message" class="success-message" style="display: none;"></div>
    <div id="error-message" class="error-message" style="display: none;"></div>
  </div>

  <div class="preview-section">
    <h3>Data Preview</h3>
    <div id="data-preview" class="preview-data">
      Fill out the form above to see a preview of your data...
    </div>
  </div>
</div>`,
    },
};
