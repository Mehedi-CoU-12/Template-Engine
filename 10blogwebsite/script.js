async function fun(){
    const [data,resultSrc,mainSrc,formSrc]=await Promise.all([
        fetch('data.json').then(res=>res.json()),
        fetch('templates/result.hbs').then(res=>res.text()),
        fetch('templates/main.hbs').then(res=>res.text()),
        fetch('templates/form.hbs').then(res=>res.text())
    ])

    Handlebars.registerPartial("result",resultSrc);

    const template=Handlebars.compile(mainSrc);

    const html=template(data.blogs);

    console.log(html)

    document.getElementById("show").innerHTML=html;
}

fun();