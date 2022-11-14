<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.isDefault" class="tag">默认</text>
					<text class="address">{{item.province}} {{item.city}} {{item.district}} {{item.address}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.name}}</text>
					<text class="mobile">{{item.mobile}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
		</view>

		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	export default {
		data() {
			return {
				source: 0,
				addressList: []
			}
		},
		onLoad(option) {},
		methods: {
			async loadData() {
				const addresses = await $http.request({
					url: '/user/addresses',
					token:"token"
				})
				addresses.forEach((item)=>{
					this.addressList.push(item)
				})
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item) {
				uni.authorize({
					scope:"scope.address",
					success() {
						uni.chooseAddress({
						  success(res) {
							  console.log(res)
						    console.log(res.userName)
						    console.log(res.postalCode)
						    console.log(res.provinceName)
						    console.log(res.cityName)
						    console.log(res.countyName)
						    console.log(res.detailInfo)
						    console.log(res.nationalCode)
						    console.log(res.telNumber)
						  },
						  fail(err) {
						  	console.log("get err")
							console.log(err)
						  }
						})
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			//添加或修改成功之后回调
			// refreshList(data, type) {
			// 	//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
			// 	this.addressList.unshift(data);

			// 	console.log(data, type);
			// }
		},
		onShow() {
			this.loadData();
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
