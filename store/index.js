import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/common/api/request.js'
Vue.use(Vuex)
// 是否有必要使用vuex？？？第二次登陆是否需要那啥》？
const store = new Vuex.Store({
	state: {
		hasLogin: false,
		hasRegistered:false,
		userInfo: {},
		token: "",
		order: {}
	},
	mutations: {
		registered(state,data){
			state.hasRegistered=data;
			console.log("registered")
		},
		login(state, data) {
			state.hasLogin = true;
			state.token = data;
			uni.setStorage({ //缓存用户登陆状态
				key: 'token',
				data: data
			})
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			state.token = "";
			uni.removeStorage({
				key: 'token'
			})
			uni.removeStorage({
				key:"userInfo"
			})
		},
		saveUserInfo(state, userInfo) {
			state.userInfo=userInfo
			uni.setStorage({
				key:"userInfo",
				data:userInfo
			})
		},
		setOrder(state, data) {
			state.order = data
		}
	},
	actions: {}
})

export default store
