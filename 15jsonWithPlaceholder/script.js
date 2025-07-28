//template engine
const templateCode = `{
    "main": "{{> header }}<section id='posts'>{{#each posts}}{{> post }}{{/each}}</section>",
    "header": "<header>  <h1>{{title}}</h1>",
    "post": "<article class='post'>  <h2>{{title}}</h2>  <p class='meta'>Posted on {{ date}} by {{author}}</p><div class='content'>{{content}}</div></article>"
        
}`;

//json string with placeholder
const dataTemplate = `{
    "title": "{{siteTitle}}",
    "posts": [
        {
            "title": "{{post1Title}}",
            "date": "{{post1Date}}",
            "author": "{{post1Author}}",
            "content": "{{post1Content}}"
        },
        {
            "title": "{{post2Title}}",
            "date": "{{post2Date}}",
            "author": "{{post2Author}}",
            "content": "{{post2Content}}"
        },
        {
            "title": "{{post3Title}}",
            "date": "{{post3Date}}",
            "author": "{{post3Author}}",
            "content": "{{post3Content}}"
        }
    ]
}`;

//placeholder data
const filledContext = {
    siteTitle: "My Awesome Blog",
    post1Title: "Introducing Our New Feature",
    post1Date: "2025-07-20T14:30:00Z",
    post1Author: "Alice",
    post1Content:
        "Today, we are excited to announce a new feature that will change the way you work with our product!",

    post2Title: "How to Boost Productivity",
    post2Date: "2025-07-18T09:00:00Z",
    post2Author: "Bob",
    post2Content:
        "In this post, we explore several practical tips to boost your productivity and manage time effectively.",

    post3Title: "Understanding Async Programming",
    post3Date: "2025-07-15T12:00:00Z",
    post3Author: "Charlie",
    post3Content:
        "Async programming can be challenging. Here we break down its key concepts and how you can master it.",
};

//fill the placeholder with actual data
const templateFn = Handlebars.compile(dataTemplate);
const filledDataJSON = templateFn(filledContext);
const data = JSON.parse(filledDataJSON);

console.log(data)

const templates = JSON.parse(templateCode);

// register partials
Object.keys(templates).forEach((key) => {
    if (key !== "main") {
        Handlebars.registerPartial(key, templates[key]);
    }
});

//compile and render main template
const mainTemplate = Handlebars.compile(templates.main);
const html = mainTemplate(data);

//inject them into dom
document.getElementById("app").innerHTML = html;
