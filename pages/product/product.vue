<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in detail.images" :key="index">
					<view class="image-wrapper">
						<image :src="item.url" class="loaded" mode="aspectFit"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">恒源祥2019春季长袖白色t恤 新款春装</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{detail.line_price}}</text>
				<text class="coupon-tip">热销折后¥{{detail.price}}</text>
			</view>
			<view class="bot-row">
				<text>销量: {{detail.sale_num}}</text>
				<text>库存: {{detail.stock_num}}</text>
				<text>浏览量: {{detail.page_view}}</text>
			</view>
		</view>

		<!--  分享 -->
		<!-- 		<view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
		</view> -->

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con" v-if="hasChoosed">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.value}}
					</text>
				</view>
				<view class="con" v-else>
					<text class="selected-text">未选择</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">购买数量</text>
				<view class="con">
					<text>{{buyNum}}</text>
				</view>
			</view>
			<!-- 	<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view> -->
			<!-- <view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view> -->
		</view>

		<!-- 评价 -->
		<view class="eva-section">
			<block v-if="detail.remark">
				<view class="e-header">
					<text class="tit">评价</text>
					<text>({{detail.remark.total}})</text>
					<text class="tip"></text>
					<text class="yticon icon-you"></text>
				</view>
				<view class="eva-box">
					<!-- <image class="portrait"
						src="https://pics6.baidu.com/feed/fd039245d688d43f2f5ede55f220cc100ff43b6f.jpeg@f_auto?token=9ad178e0c6553d9f3645551edef31eb4"
						mode="aspectFill"></image> -->
					<view class="right">
						<text class="name">{{detail.remark.name}}</text>
						<text class="con">{{detail.remark.remark}}</text>
						<view class="bot">
							<text class="attr">购买类型：{{detail.remark.attrs}}</text>
							<text class="time">{{detail.remark.add_time}}</text>
						</view>
					</view>
				</view>
			</block>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="detail.desc"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: detail.favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="choose.preview"> </image>
					<view class="right">
						<view class="price-box">
							<block v-if="choose.price!=choose.line_price">
								<text class="price">¥{{choose.price}}</text>
								<text class="m-price">原价¥{{choose.line_price}}</text>
							</block>
							<block v-else>
								<text class="price">¥{{choose.price}}</text>
							</block>
						</view>
						<text class="stock">库存：{{choose.stock_num}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.value}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in detail.specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in item.valueList" :key="childIndex" class="tit"
							:class="{selected: childItem.selected}" @click="selectSpec(childIndex, index)">
							{{childItem.value}}
						</text>
					</view>
				</view>
				<view class="attr-list">
					<view class="selected-number">
						<text>数量</text>
						<uni-number-box v-model="buyNum" :min=1 :max="choose.stock_num"></uni-number-box>
					</view>
				</view>
				<view class="attr-list">
					<button class="btn" @click="finish" style="margin-inline: 0;">完成</button>
				</view>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js';
	import share from '@/components/share';
	import uniNumberBox from '@/components/uni-number-box.vue'
	import store from '@/store/index.js'

	export default {
		components: {
			share,
			uniNumberBox
		},
		data() {
			return {
				specClass: 'none',
				specSelected: [],
				shareList: [],
				detail: {},
				buyNum: 1,
				hasChoosed: false, //是否还没有进行过选择
				next: "" //点击完成之后的去处
			};
		},
		async onLoad(options) {
			//接收传值,id里面放的是标题，因为测试数据并没写id
			let id = options.id;
			let data = await $http.request({
				url: "/goods/detail/" + id,
			})
			data.image = $http.media(data.image)
			data.images.forEach(item => {
				item.url = $http.media(item.url)
			})
			data.skuList.forEach(item => {
				item.preview = $http.media(item.preview)
			})
			this.detail = data;
			//规格 默认选中第一条
			this.detail.specList.forEach(item => {
				for (let cItem of item.valueList) {
					this.specSelected.push(cItem);
					this.$set(cItem, 'selected', true);
					break; //forEach不能使用break
				}
			})
		},
		computed: {
			choose() {
				let choosId = [];
				this.specSelected.forEach(item => {
					choosId.push(item.id)
				})
				choosId.sort()
				let key_id = choosId.join("__")
				let res = []
				if (this.detail.skuList) {
					this.detail.skuList.forEach(item => {
						if (item.sku_id === key_id) {
							res.push(item)
						}
					})
					return res[0]
				} else {
					return {}
				}
			}
		},
		methods: {
			//规格弹窗开关
			toggleSpec() {
				if (!this.hasChoosed) {
					this.hasChoosed = true
				}
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			finish() { //完成
				if (this.next === "cart") {
					this.addCart()
					this.toggleSpec()
				} else if (this.next === "buy") {
					this.buy()
				} else {
					this.toggleSpec()
				}
			},
			//选择规格
			selectSpec(childIndex, index) {
				let list = this.detail.specList[index];
				list.valueList.forEach(item => {
					this.$set(item, 'selected', false);
				})
				this.$set(list.valueList[childIndex], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				this.detail.specList.forEach(item => {
					item.valueList.forEach(subItem => {
						if (subItem.selected === true) {
							this.specSelected.push(subItem);
						}
					})
				})
			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite() {
				$http.request({
					method: "POST",
					url: `/user/favorite?goods_id=${this.detail.id}&favorite=${!this.detail.favorite}`,
					token: "token"
				}).then(value => {
					this.detail.favorite = value.favorite
				})
				this.detail.favorite = !this.detail.favorite;
			},
			addCart() {
				if (!this.hasChoosed) {
					this.next = "cart"
					this.toggleSpec()
					return
				}
				$http.request({
					method: "POST",
					url: `/cart/goods`,
					token: true,
					data: {
						goods_id: this.detail.id,
						sku_id: this.choose.id,
						number: this.buyNum
					}

				}).then(value => {
					uni.showToast({
						title: "加入购物车成功"
					})
				})
			},
			buy() {
				// 先判断登录没
				$http.login().then(() => {
					if (!this.hasChoosed) {
						this.next = "buy"
						this.toggleSpec()
						return
					}
					let goodsData = [];
					goodsData.push({
						goods: {
							name: this.detail.name,
							image: this.choose.preview,
							attrs: this.choose.attrs,
							price: this.choose.price,
							line_price: this.choose.line_price,
							id: this.detail.id,
							sku_id: this.choose.id
						},
						number: this.buyNum,
						checked: true
					})
					store.commit('setOrder', goodsData);
					uni.navigateTo({
						url: `/pages/order/createOrder`
					})
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.selected-number {
			display: flex;
			flex-direction: initial;

			text {
				margin-block: auto;
				margin-right: 10upx;
			}

			.uni-numbox {
				position: relative;
			}
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			view {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
</style>
