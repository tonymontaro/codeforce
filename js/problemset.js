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
                    let color = "#fff";
                    if (rating >= 0 && rating < 1200) color = "#ccc";
                    if (rating >= 1200 && rating < 1400) color = "#76fd77";
                    if (rating >= 1400 && rating < 1600) color = "#77ddbb";
                    if (rating >= 1600 && rating < 1900) color = "#aaf";
                    if (rating >= 1900 && rating < 2100) color = "#f988ff";
                    if (rating >= 2100 && rating < 2300) color = "#fdcc87";
                    if (rating >= 2300 && rating < 2400) color = "#ffbb55";
                    if (rating >= 2400 && rating < 2600) color = "#f77";
                    if (rating >= 2600) color = "#f33";
                    problems[name].color = color;
                    problems[name].id = name;
                }
                for (let item of data.result.problemStatistics) {
                    let { contestId, index } = item;
                    let name = `${contestId}/${index}`;
                    // problems[name].solvedCount = item.solvedCount;
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
                const tofile = JSON.stringify(res, null, 2);

                fs.writeFile('js/data.json', tofile, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("JSON data is saved.");
                });
            });
    });



