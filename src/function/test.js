// module "my-module.js"
async function serializeDict(dataObj) {
    const dateList = await dateFormate(dataObj)
    const newCaseList = await newCase(dataObj.cases)
    const newDeathsList = await newCase(dataObj.deaths)

    return {
        date: dateList,
        case: newCaseList,
        deaths: newDeathsList,
    }
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


export { serializeDict };
