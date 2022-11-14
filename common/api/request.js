import store from '@/store/index.js'
export default {
	common: {
		baseUrl: "http://192.168.31.86:8000/api",
		mediaUrl: "http://192.168.31.86:8000/media/",
		data: {},
		header: {
			"Content-Type": "application/json"
		},
		method: "GET",
		dataType: "json"
	},
	media(s) {
		return this.common.mediaUrl + s
	},
	login() {
		return new Promise((nextFunc, failFunc) => {
			let _self = this;
			uni.login({
				provider: "weixin",
				onlyAuthorize: true, // 微信登录仅请求授权认证
				success(event) {
					const {
						code
					} = event
					//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
					uni.request({
						url: _self.common.baseUrl + '/user/loginByWeixin', //仅为示例，并非真实接口地址。
						data: {
							code: event.code
						},
						success: (res) => {
							//获得token完成登录
							store.commit('login', res.data.token)
							if (!res.data.registered) {
								uni.getUserInfo({
									provider: "weixin",
									success(value) {
										store.commit('saveUserInfo', value.userInfo)
										uni.request({
											url: "/user/userInfo",
											data: value.userInfo,
											method: "POST",
											token: res.token
										})
									}
								})
							}
							nextFunc()
						}
					});
				},
				fail: function(err) {
					// 登录授权失败
					uni.showToast({
						title: "登录失败",
						icon: "none"
					})
					// err.code是错误码
				}
			})
		})
	},
	request(options = {}) {
		uni.showLoading({
			title: '加载中'
		});

		options.url = this.common.baseUrl + options.url;
		options.data = options.data || this.common.data;
		options.header = options.header || {
			"Content-Type": "application/json"
		};
		options.method = options.method || this.common.method;
		options.dataType = options.dataType || this.common.dataType;

		//判断是否传入了header头的token进行用户是否登录的验证
		const token = store.state.token;
		if (options.token && !token) {
			uni.showToast({
				title: "请先登录",
				icon: "none"
			})
			return this.login()
		}
		options.header.token = token;
		return new Promise((res, rej) => {
			uni.request({
				...options,
				success: (result) => {
					if (result.statusCode != 200) {
						return rej(result);
					}
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
					console.log(result)
					let data = result.data;
					res(data);
				}
			})
		})
	},
	requestSync(options = {}) {

		uni.showLoading({
			title: '加载中'
		});

		options.url = this.common.baseUrl + options.url;
		options.data = options.data || this.common.data;
		options.header = options.header || {
			"Content-Type": "application/json"
		};
		options.method = options.method || this.common.method;
		options.dataType = options.dataType || this.common.dataType;

		//判断是否传入了header头的token进行用户是否登录的验证
		const token = store.state.token;
		if (options.token && !token) {
			uni.showToast({
				title: "请先登录",
				icon: "none"
			})
			this.login()
			return
		}
		options.header.token = token;
		return uni.request({
			...options
		})
	}
}
