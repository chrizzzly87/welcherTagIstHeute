const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
const app = express();
const HTMLParser = require('node-html-parser');

app.listen(1987, () => {
    console.log("Server running on port 1987");
});

app.get("/", (req, res, next) => {
    res.send('läuft');
});

app.get("/no-not-na-day-n", (req, res, next) => {
    const route = 'https://welcher-tag-ist-heute.org';
    let days = [];
    fetch(route)
        .then(res => res.text())
        .then(body => {
            let parsedBody = HTMLParser.parse(body);
            let slides = parsedBody.querySelectorAll('.slides a');
            let days = [];
            if (slides) {
                slides.forEach(slide => {
                    let title = slide.querySelector('h2').innerHTML.trim();
                    let description = slide.querySelector('p.text').innerHTML.trim();
                    days.push({title: title, description: description});
                });
            }            
            res.json(days).end();
        });
});