<script src="../../../mix-mall2/Json.js"></script>
<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasRegistered || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasRegistered" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasRegistered" url="../index/index" open-type="switchTab">随便逛逛>
				</navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
						<view class="image-wrapper">
							<image :src="item.goods.image" style="opacity:1"></image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}"
								@click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.goods.name}}</text>
							<text class="attr">{{item.goods.attrs}}</text>
							<text class="price">¥{{item.goods.price}}</text>
							<uni-number-box class="step" :min=1 :value="item.number" :isMin="item.number===1"
								:index="index" @eventChange="numberChange"></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked?'/static/selected.png':'/static/select.png'" mode="aspectFit"
						@click="check('all')"></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total}}</text>
					<!-- <text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text> -->
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import {
		mapState
	} from 'vuex';
	import store from '@/store/index.js'

	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				cartList: [],
				loaded: false
			};
		},
		onLoad() {},
		computed: {
			...mapState(['hasRegistered']),
			empty() {
				if (this.cartList.length > 0) {
					return false
				}
				return true
			}
		},
		methods: {
			async loadData() {
				//请求数据
				if (this.hasRegistered) {
					let list = await $http.request({
						url: "/cart/goods",
						token: true
					}).then(cartList => {
						cartList.forEach(item => {
							for (let i = 0; i < this.cartList.length; i++) {
								let oldItem = this.cartList[i]
								if (oldItem.id === item.id) {
									this.cartList[i].number = item.number
									return
								}
							}
							item.checked = true;
							item.goods.image = $http.media(item.goods.image)
							this.cartList.push(item)
						})
						let waitDel = []
						this.cartList.forEach((oldItem, index) => {
							for (let i = 0; i < cartList.length; i++) {
								let item = cartList[i]
								if (oldItem.id === item.id) {
									return
								}
							}
							waitDel.push(index)
						})
						waitDel.reverse()
						waitDel.forEach(index => {
							this.cartList.splice(index, 1)
						})
						this.calcTotal(); //计算总价
					})
				}
			},
			navToLogin() {
				const token = store.state.token;
				let _self = this;
				uni.getUserProfile({
					desc: "用户微信登录",
					success(value) {
						store.commit('registered', true)
						store.commit('saveUserInfo', value.userInfo)
						$http.request({
							url: "/user/userInfo",
							data: value.userInfo,
							method: "POST",
							token: token
						})
						_self.loadData()
					}
				})
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data) {
				console.log("numberCahange")
				this.cartList[data.index].number = data.number;
				this.calcTotal();
				$http.request({
					url: `/cart/number?cart_id=${this.cartList[data.index].id}&number=${data.number}`,
					method: "POST",
				}, false)
			},
			//删除
			deleteCartItem(index) {
				let list = this.cartList;
				let row = list[index];
				let id = row.id;
				$http.request({
					url: "/cart/goods/remove?cart_id=" + id,
					method: "DELETE",
				}).then(result => {
					this.cartList.splice(index, 1);
					this.calcTotal();
					uni.hideLoading();
				})
			},
			//清空
			clearCart() {
				uni.showModal({
					content: '清空购物车？',
					success: (e) => {
						if (e.confirm) {
							$http.request({
								url: "/cart/goods/clear",
								method: "DELETE"
							}).then(() => {
								this.cartList = []
							})
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						total += item.goods.price * item.number;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder() {
				let goodsData = [];
				this.cartList.forEach(item => {
					if (item.checked) {
						goodsData.push(item)
					}
				})
				store.commit('setOrder', goodsData);
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			}
		},
		onShow() {
			if (this.hasRegistered){
				this.loadData()
			}
		}
	}
</script>

<style lang='scss'>
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: .2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}
</style>
