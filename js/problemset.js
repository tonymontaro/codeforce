const fs = require('fs');


const fetch = require('node-fetch');

let problemUrl = "https://codeforces.com/api/problemset.problems";
let contestUrl = "https://codeforces.com/api/contest.list?gym=false";

let settings = { method: "Get" };

fetch(problemUrl, settings)
    .then(res => res.json())
    .then((json) => {
        const data = json;

        fetch(contestUrl, settings)
            .then(res => res.json())
            .then((json) => {
                const ct = json;


                const cts = ct.result;

                const problemsData = data.result.problems;
                let count = 0;
                const problems = {};
                const contests = {};
                for (let item of problemsData) {
                    let { contestId, index, rating } = item;
                    let name = `${contestId}/${index}`;
                    if (contests[contestId] == undefined) contests[contestId] = [];
                    contests[contestId].push(name);
                    problems[name] = item;
                    let color = "#7f7f7f";
                    if (rating >= 800 && rating < 1000) color = "#804001";
                    if (rating >= 1000 && rating < 1200) color = "#007f01";
                    if (rating >= 1200 && rating < 1600) color = "#04c0c0";
                    if (rating >= 1600 && rating < 2000) color = "#0d00ff";
                    if (rating >= 2000 && rating < 2400) color = "#bfc002";
                    if (rating >= 2400 && rating < 2800) color = "#ff8001";
                    if (rating >= 2800) color = "#fe0200";
                    problems[name].color = color;
                    problems[name].id = name;
                }
                for (let item of data.result.problemStatistics) {
                    let { contestId, index } = item;
                    let name = `${contestId}/${index}`;
                    problems[name].solvedCount = item.solvedCount;
                }

                const groups = {
                    "Educational": [], "Div. 3": [], "Div. 2": [], "Div. 1": [], "Div. 3": [], "other": [],
                }

                for (let c of cts) {
                    let group = "other";
                    for (let g of Object.keys(groups)) {
                        if (c.name.match(g)) {
                            group = g;
                            break;
                        }
                    }
                    groups[group].push(c.id);
                }

                const res = { groups, problems, contests }
                console.log(Object.keys(res))
                const tofile = JSON.stringify(res);

                fs.writeFile('js/data.json', tofile, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("JSON data is saved.");
                });
            });
    });



