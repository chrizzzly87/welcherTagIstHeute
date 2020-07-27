const express = require("express");
const fetch = require('node-fetch');
const app = express();
const HTMLParser = require('node-html-parser');

const PORT = process.env.PORT || 1987;

app.listen(PORT, () => {
    console.log("Server running on port 1987");
});

app.get("/", (req, res, next) => {
    res.send('läuft');
});

function formatDate(d) {
    let date = new Date(d);
    let month = ('0' + (date.getMonth() + 1)).substring(-2);
    let day = ('0' + date.getDate()).substring(-2);

    return `${month}${day}`;
}

let cache = {};

app.get("/no-not-na-day-n", (req, res, next) => {
    const route = 'https://welcher-tag-ist-heute.org';
    let startTime = new Date().getMilliseconds();
    let cache = req.query.disablecache ? req.query.disablecache : 0;
    // get current day to check if it's already cached
    let currentDay = formatDate(Date.now());
    if (currentDay in cache && cache !== 0) {
        let totalExecutionTime = new Date().getMilliseconds() - startTime;
        let result = cache[currentDay];
        result.fromCache = true;
        result.executionTime = totalExecutionTime;
        res.json(result);
    } else {
        fetch(route)
            .then(res => res.text())
            .then(body => {
                let parsedBody = HTMLParser.parse(body);
                let slides = parsedBody.querySelectorAll('.slides a');
                let result = [];
                let days = [];
                if (slides) {
                    slides.forEach(slide => {
                        let title = slide.querySelector('h2').innerHTML.trim();
                        let description = slide.querySelector('p.text').innerHTML.trim();
                        days.push({
                            title: title,
                            description: description
                        });
                    });
                }
                let totalExecutionTime = new Date().getMilliseconds() - startTime;
                result = {
                        executionTime: totalExecutionTime,
                        fromCache: false,
                        result: days,
                    },
                    // save to cache
                    cache[currentDay] = result;
                res.json(result);
            });
    }
});