import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		token: null
	},
	mutations: {
		login(state, data) {
			state.hasLogin = true;
			state.token=data;
			uni.setStorage({ //缓存用户登陆状态
				key: 'token',
				data: data
			})
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			state.token=null;
			uni.removeStorage({
				key: 'userInfo'
			})
			uni.removeStorage({
				key:'token'
			})
		},
		userInfo(state, userInfo) {
			uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		}
	},
	actions: {}
})

export default store
