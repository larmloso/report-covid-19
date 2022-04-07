import axios from "axios"

export default ({
    namespaced: true,
    state: {
        dataObj: null,
    },
    getters: {
        dataTable(state) {
            return state.dataObj
        }

    },

    mutations: {

        SET_DATA(state, data) {
            state.dataObj = data
        }
    },

    actions: {
        async report({dispatch}, number) {
            let { data } = await axios.get(`https://disease.sh/v3/covid-19/historical/all?lastdays=${number}`);
            return dispatch('serializeDict', data)
        },

        async serializeDict({ commit }, dataObj) {

            const dateList = []
            const newcaseList = []
            const dataObjs = []
            const dataTable = []

            Object.keys(dataObj.cases).forEach(function (key) {
                const cases = dataObj.cases[key];
                dataObjs.push({ date: key, cases: cases });
            });

            dataObjs.reverse();

            for (let i = 0; i < dataObjs.length; i++) {
                if (i == 0) { console.log("") } 
                else {
                  const newcase = dataObjs[i - 1].cases - dataObjs[i].cases;
                  newcaseList.push(newcase);
                  dateList.push(dataObjs[i - 1].date);
                  dataTable.push({...dataObjs[i - 1], newcase: newcase})
                  if (i == dataObjs.length - 1) {
                    break;
                  }
                }
            }

            dateList.reverse()
            newcaseList.reverse()
    
            commit('SET_DATA', dataTable )
            return { date: dateList, new_case: newcaseList }
        }
    },
})

