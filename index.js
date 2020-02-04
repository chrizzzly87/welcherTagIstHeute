const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
const app = express();
const xlsx = require('node-xlsx').default;
const HTMLParser = require('node-html-parser');

app.listen(1987, () => {
    console.log("Server running on port 1987");
});

app.get("/", (req, res, next) => {
    res.send('läuft');
});

app.get("/create", (req,res,next) => {
    const filePath = `test.xlsx`;
    const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
    var buffer = xlsx.build([{name: "mySheetName", data: data}]); // Returns a buffer
    fs.writeFileSync(filePath, buffer, 'utf8', function (err) {
        if (err) {
            res.send('Failed to save file');
        } else {
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + fileName
            });
            fs.createReadStream(filePath).pipe(res);
            //res.send('file saved');
        }
    });

});

app.get("/valentin", (req, res, next) => {
    let query = req.query;
    res.send(query.ist);
});

app.get("/no-not-naday", (req, res, next) => {
    const route = 'https://welcher-tag-ist-heute.org';
    let response = '';
    let body = '';
    await fetch(route)
        .then(reponse => res.text())
        .then(body => body);
    
    let parsedBody = HTMLParser.parse(body);
    let slides = parsedBody.querySelectAll('.slides a h2');
    let days = [];
    if (slides) {
        slides.forEach(slide => {
            console.log(slide.innerHTML);
            days.push(slide.innerHTML);
        });
    }

    res.json(days);
});

app.get('/xmo/:idMarket/:idRegion/:lang', async (req, res, next) => {
    let idMarket = req.params.idMarket || 200;
    let idRegion = req.params.idRegion || 137;
    let lang = req.params.lang || 'de';
    const xmoRoute = `https://stat-forecast.corp.statista.com/forecast/outlook?market=${idMarket}&country=${idRegion}&locale=${lang}`;
    console.log('fetching data');

    const xmoResponse = await fetch(xmoRoute);
    console.log('getting response');
    const xmoData = await xmoResponse.json();
    console.log('retourning json');
    
    let charts = await xmoData.charts;
    let result = [];
    charts.forEach(chart => {
        let r = {
            title: chart.title,
            description: stripTags(chart.infoText),
            unit: chart.unit.description,
            data: []
        };

        let dataSet = chart.functions;
        dataSet.forEach(data => {
            data.values.forEach(value => {
                let d = {title: dataSet[0].metaInformation.name};
                d.value = {
                    x: value.x[0].value,
                    y: value.y.value
                };
                r.data.push(d)
            });
        });

        result.push(r);
    });
    res.json(result);
    res.json(charts);
});

function stripTags(str) {
    return str.replace(/<[^>]*>?/gm, '');
}

app.get("/info", (req, res, next) => {
    let currentDate = new Date().toLocaleDateString('de-DE',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    let isNadineCool = (Math.random() >= 0.5) ? 'ist cool' : 'ist nicht cool';
    res.json({
        status: 'läuft bei mir so richtig toll',
        message: 'in a bottle',
        datum: currentDate,
        nadine: isNadineCool
    });
});