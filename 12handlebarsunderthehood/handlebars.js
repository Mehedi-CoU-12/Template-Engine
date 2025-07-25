async function fun() {
    
    const [data, indexHbs] = await Promise.all([
        fetch("./index.json").then((v) => v.json()),
        fetch("./show.json")
            .then((v) => v.json())
            .then((value) => value.template)
    ]);


    //main
    const template = Handlebars.compile(indexHbs);
    const html = template(data);

    document.getElementById("template").innerHTML = html;
}

fun();
