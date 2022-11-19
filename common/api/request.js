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
			const token = store.state.token;
			if(token) {
				return nextFunc()
			}
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
							const token = res.data.token;
							store.commit('login', token)
							if (!res.data.registered) {
								uni.getUserInfo({
									success(value) {
										store.commit('saveUserInfo', value.userInfo)
										_self.request({
											url: "/user/userInfo",
											data: value.userInfo,
											method: "POST",
											token: token
										})
									}
								})
							} else {
								_self.request({
									url: "/user/userInfo",
									method: "GET",
									token: token,
									success(result) {
										store.commit('saveUserInfo', result.data)
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
	request(options = {},showloading = true) {
		if (showloading){
			uni.showLoading({
				title: '加载中'
			});
		}
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
					if (showloading){
						setTimeout(function() {
							uni.hideLoading();
						}, 100);
					}
					if (!(result.statusCode >= 200 && result.statusCode<300)) {
						uni.showToast({
							title: result.errMsg || "请求失败",
							icon: "none"
						})
						rej(result);
					} else {
						res( result.data);
					}
				},
				fail: (err) => {
					if (showloading){
						uni.hideLoading()
					}
					uni.showToast({
						title: err.errMsg,
						icon: "none"
					})
					rej(err)
				}
			})
		})
	}
}
