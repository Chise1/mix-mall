import store from '@/store/index.js'
export default {
	common: {
		baseUrl: "http://127.0.0.1:8000/api",
		mediaUrl: "http://127.0.0.1:8000/media/",
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
	request(options = {}) {

		uni.showLoading({
			title: '加载中'
		});

		options.url = this.common.baseUrl + options.url;
		options.data = options.data || this.common.data;
		options.header = options.header || this.common.header;
		options.method = options.method || this.common.method;
		options.dataType = options.dataType || this.common.dataType;

		//判断是否传入了header头的token进行用户是否登录的验证
		if (options.header.token) {
			options.header.token = store.state.token;
			if (!options.header.token) {
				uni.showToast({
					title: "请先登录",
					icon: "none"
				})
				return uni.navigateTo({
					url: "/pages/public/login"
				})
			}
		}
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
		options.header = options.header || this.common.header;
		options.method = options.method || this.common.method;
		options.dataType = options.dataType || this.common.dataType;

		//判断是否传入了header头的token进行用户是否登录的验证
		if (options.header.token) {
			options.header.token = store.state.token;
			if (!options.header.token) {
				uni.showToast({
					title: "请先登录",
					icon: "none"
				})
				return uni.navigateTo({
					url: "/pages/public/login"
				})
			}
		}
		return uni.request({
			...options
		})
	}
}
