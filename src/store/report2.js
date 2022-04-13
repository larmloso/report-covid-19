import axios from "axios"
import { serializeDict } from '../function/test'

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
        async report({commit}, number) {
            let { data } = await axios.get(`https://disease.sh/v3/covid-19/historical/all?lastdays=${number}`);
            commit('SET_DATA', 'dataTable' )
            return await serializeDict(data)
        },
    },
})

