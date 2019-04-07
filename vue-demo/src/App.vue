<template>
	<div id="app">
		<el-container style="height: 100%; border: 0">
			<!-- 侧边栏 -->
			<el-aside style="background-color: #545c64;" @mouseenter.native="collapseOpen" @mouseleave.native="collapseClose"
			 width="auto">
				<el-menu class="el-menu-vertical-demo" :default-active="activeIndex" :active="activeIndex" background-color="#545c64"
				 text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" style="border: 0;" :collapse="isCollapse">
					<el-menu-item index="1">
						<i class="el-icon-menu"></i>
						<span slot="title">实体搜索</span>
					</el-menu-item>
					<el-menu-item index="2">
						<i class="el-icon-menu"></i>
						<span slot="title">实体详情</span>
					</el-menu-item>
					<el-menu-item index="3">
						<i class="el-icon-menu"></i>
						<span slot="title">实体关联</span>
					</el-menu-item>
					<el-menu-item index="4">
						<i class="el-icon-menu"></i>
						<span slot="title">图片服务</span>
					</el-menu-item>
				</el-menu>
			</el-aside>

			<!-- 路由 -->
			<el-main style="padding: 0;">
				<router-view />
			</el-main>

		</el-container>


	</div>
</template>

<script>
	import * as RestAPI from './api/RestAPI'

	export default {
		name: 'App',
		data() {
			return {
				//当前被激活的按钮
				activeIndex: "1",
				//侧边栏是否展开
				isCollapse: true
			}
		},
		mounted() {
			//将对应的按钮设为"被点击"
			this.changeIndex();
		},
		methods: {
			//监听侧边栏的点击，点击相应按钮后更换路由
			handleSelect(key, keyPath) {
				console.log(key);
				console.log(keyPath);

				switch (key) {
					case "1":
						{
							//路由跳转
							this.$router.push({ //核心语句
								path: '/EntitySearch', //跳转的路径
							})
							break;
						}
					case "2":
						{
							this.$router.push({ 
								path: '/EntityDetail', 
							})
							break;
						}
					case "3":
						{
							this.$router.push({
								path: '/EntityNetwork',
							})
							break;
						}
					case "4":
						{
							this.$router.push({
								path: '/ImageView'
							})
							break;
						}
				}
			},
			// 以下两个函数是实现"鼠标靠近侧边栏，侧边栏就弹出"
			collapseOpen() {
				this.isCollapse = false;
			},
			collapseClose() {
				this.isCollapse = true;
			},
			// 将对应的按钮设为"被点击"
			changeIndex() {
				//菜单跳转
				var url = this.$route.path;
				if (url == "/EntitySearch") this.activeIndex = "1";
				if (url == "/EntityDetail") this.activeIndex = "2";
				if (url == "/EntityNetwork") this.activeIndex = "3";
				if (url == "/ImageView") this.activeIndex = "4";
			}
		},
		watch: {
			// 监听当前url,将对应的按钮设为"被点击"
			'$route': 'changeIndex'
		}
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		height: 100%;
		width: 100%;
		border: 0;
		margin: 0;
		padding: 0;
	}

	html,
	body {
		position: relative;
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
		border: 0;
	}

	;
</style>
