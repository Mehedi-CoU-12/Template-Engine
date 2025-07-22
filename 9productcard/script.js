async function load(){
    const [data
        ,mainSrc,cardSrc
    ]=await Promise.all([
        fetch('data.json').then((value)=>value.json()),
        fetch('templates/main-template.hbs').then(value=>value.text()),
        fetch('templates/product-card.hbs').then(value=>value.text())
    ])

    Handlebars.registerPartial("product-card",cardSrc);

    const template=Handlebars.compile(mainSrc);
    const html=template(data);

    document.getElementById('catalog').innerHTML=html;

    console.log(data)
}

load()