// module "my-module.js"

import axios from "axios"

async function callAPI(days, country) {

    if (country == 'All') {
        let { data } = await axios.get(`https://disease.sh/v3/covid-19/historical/all?lastdays=${days}`);
        const dateList = await dateFormate(data)
        const newCaseList = await newCase(data.cases)
        const newDeathsList = await newCase(data.deaths)
        const dataTableObj = []

        dateList.forEach((data, index) => {
            dataTableObj.push({"date": data, "case": newCaseList[index], "deaths": newDeathsList[index]})
        })

        return {
            date: dateList,
            case: newCaseList,
            deaths: newDeathsList,
            dataTable: dataTableObj.reverse()
        }
    } else {
        let { data } = await axios.get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=${days}`);
        const dateList = await dateFormate(data.timeline)
        const newCaseList = await newCase(data.timeline.cases)
        const newDeathsList = await newCase(data.timeline.deaths)
        const dataTableObj = []

        dateList.forEach((data, index) => {
            dataTableObj.push({"date": data, "case": newCaseList[index], "deaths": newDeathsList[index]})
        })

        return {
            date: dateList,
            case: newCaseList,
            deaths: newDeathsList,
            dataTable: dataTableObj.reverse()
        }
    }
}

async function getTotal(country) {
    if (country == 'All') {
        let { data } = await axios.get(`https://disease.sh/v3/covid-19/countries/th?strict=true`);
        return data
    } else {
        let { data } = await axios.get(`https://disease.sh/v3/covid-19/countries/${country}?strict=true`);
        return data
    }
}
async function getAll() {
    let { data } = await axios.get('https://disease.sh/v3/covid-19/all');
    console.log('dataall ', data)
    return data
}


// get Datetime deaths recovered
async function dateFormate(dataObj) {
    const dateList = []
    Object.keys(dataObj.cases).forEach(function (key, index) {
        if (index == 0) {
            console.log("")
        } else {
            dateList.push(key);
        }
    });
    return dateList
}

// get newCase
async function newCase(dataObj) {

    const newcaseList = []
    const dataObjs = []

    Object.keys(dataObj).forEach(function (key) {
        const label = dataObj[key];
        dataObjs.push({ label: label });
    });

    dataObjs.reverse();

    for (let i = 0; i < dataObjs.length; i++) {
        if (i == 0) { console.log("") }
        else {
            const newcase = dataObjs[i - 1].label - dataObjs[i].label;
            newcaseList.push(newcase);
            if (i == dataObjs.length - 1) {
                break;
            }
        }
    }

    return newcaseList.reverse()
}

export { callAPI, getTotal, getAll };
