import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showLoginbtn: true, // 登陆状态
        showUser: false, // 用户显示状态
        userInfo: {
            username: '',
            avatar: ''
        }
    },
    mutations: {},
    actions: {},
    modules: {}
})