//template engine
const templateCode = `{
        "main": "{{> header }}<section id='posts'>{{#each posts}}{{> post }}{{/each}}</section>{{> footer }}",
        "header": "<header>  <h1>{{title}}</h1>",
        "post": "<article class='post'>  <h2>{{title}}</h2>  <p class='meta'>Posted on {{ date}} by {{author}}</p><div class='content'>{{content}}</div></article>",
        "footer": "<footer>  <p>&copy; 2025 My Awesome Blog. All rights reserved.</p></footer>"
    }`;

//actual data
const data1 = `{
        "title": "My Awesome Blog",
        "posts": [
            {
                "title": "Introducing Our New Feature",
                "date": "2025-07-20T14:30:00Z",
                "author": "Alice",
                "content": "Today, we are excited to announce a new feature that will change the way you work with our product!"
            },
            {
                "title": "How to Boost Productivity",
                "date": "2025-07-18T09:00:00Z",
                "author": "Bob",
                "content": "In this post, we explore several practical tips to boost your productivity and manage time effectively."
            },
            {
                "title": "Understanding Async Programming",
                "date": "2025-07-15T12:00:00Z",
                "author": "Charlie",
                "content": "Async programming can be challenging. Here we break down its key concepts and how you can master it."
            }
        ]
    }`;

//parse them into json
const templates = JSON.parse(templateCode);
const data = JSON.parse(data1);

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
