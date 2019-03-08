<template>
	<div id="app">
		<el-container style="height: 100%; border: 0">
			<el-aside width="200px" style="background-color: #545c64">
				<el-menu class="el-menu-vertical-demo" :default-active="activeIndex" :active="activeIndex" background-color="#545c64" text-color="#fff"
				 active-text-color="#ffd04b" @select="handleSelect" style="border: 0;">
					<el-menu-item index="1">
						<i class="el-icon-menu"></i>
						<span slot="title">实体详情</span>
					</el-menu-item>
					<el-menu-item index="2">
						<i class="el-icon-menu"></i>
						<span slot="title">实体关联</span>
					</el-menu-item>
				</el-menu>
			</el-aside>

			<el-container>
				<el-header style="text-align: right; font-size: 12px; background-color: #737d87;">

					<el-autocomplete v-model="currKeyword" :fetch-suggestions="searchEntityAsync" placeholder="请输入搜索关键字" @select="handleSelectEntity"
					 style="width:400px; top: 10px;" clearable></el-autocomplete>

					<!-- <el-button type="primary" @click="showSearchResults" icon="el-icon-search" :disabled="searchBtnDisabled"></el-button> -->

				</el-header>

				<el-main>
					<router-view />
				</el-main>
			</el-container>
		</el-container>


	</div>
</template>

<script>
	import * as RestAPI from './api/RestAPI'

	export default {
		name: 'App',
		data() {
			return {
				currKeyword: '',
				cn: false,
				size: 10,
				fullText_FQDN: "",
				suggested_entities: [],
				entityTags: [],
				selectedEntity: {
					'name': '',
					'FQDN': ''
				},
				searchResults: [],
				searchHistory: [],
				timeout: null,
				uuid: null,
				activeIndex: "1"
			}
		},
		methods: {
			handleSelect(key, keyPath) {
				console.log(key);
				console.log(keyPath);

				switch (key) {
					case "1":
						{
							//路由跳转
							this.$router.push({ //核心语句
								path: '/EntityDetail', //跳转的路径
								query: { //路由传参时push和query搭配使用 ，作用时传递参数
									uuid: this.uuid,
								}
							})
							break;
						}
					case "2":
						{
							//路由跳转
							this.$router.push({ //核心语句
								path: '/EntityNetwork', //跳转的路径
								query: { //路由传参时push和query搭配使用 ，作用时传递参数
									uuid: this.uuid,
								}
							})
							break;
						}
				}
			},
			searchEntityAsync(keyword, cb) {
				//网络通讯部分，现在因为跨域问题无法使用
				// 				RestAPI.searchEntity(keyword, _this.size).then(res => {
				// 					console.log(res);
				// 					if (res.data.statusCode === 200) {
				// 						_this.suggested_entities = res.data.data;
				// 						console.log("suggested_entities");
				// 						console.log(_this.suggested_entities);
				// 
				// 						var results = [];
				// 						for (var i = 0; i < _this.suggested_entities.length; i++) {
				// 							var entity = _this.suggested_entities[i];
				// 							var FQDN = entity.FQDN;
				// 							var value = "";
				// 							switch (_this.selectedSearchMode) {
				// 								case "filter":
				// 									value = entity.name;
				// 									break;
				// 								case "prefix":
				// 									value = master_FQDN === "" ? FQDN : FQDN.substring(master_FQDN.length + 1);
				// 									break;
				// 								default:
				// 									value = entity.FQDN;
				// 									break;
				// 							}
				// 							results.push({
				// 								"value": value,
				// 								"FQDN": FQDN
				// 							});
				// 						}
				// 						console.log("results:")
				// 						console.log(results);
				// 						cb(results);
				// 					}
				// 				}).catch(err => {
				// 					console.log(err)
				// 				});

				var _this = this;

				if (keyword == "") {
					cb(_this.searchHistory);
				} else {
					_this.suggested_entities = [{
						"master_FQDN": "东莞市政府",
						"score": 22.752232,
						"FQDN": "东莞市政府 行政中心北楼",
						"name": "行政中心北楼",
						"id": 6,
						"type": "building",
						"uuid": "S000120010006",
						"FQDN_alias": "东莞市政府 行政中心北楼",
						"desc": "",
						"order": 4
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼",
						"score": 22.093384,
						"FQDN": "东莞市政府 行政中心北楼 1F",
						"name": "1F",
						"id": 37,
						"type": "floor",
						"uuid": "S000120020037",
						"FQDN_alias": "东莞市政府 行政中心北楼 1F",
						"desc": "",
						"order": 0
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼",
						"score": 22.093384,
						"FQDN": "东莞市政府 行政中心北楼 2F",
						"name": "2F",
						"id": 38,
						"type": "floor",
						"uuid": "S000120020038",
						"FQDN_alias": "东莞市政府 行政中心北楼 2F",
						"desc": "",
						"order": 0
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼",
						"score": 22.093384,
						"FQDN": "东莞市政府 行政中心北楼 3F",
						"name": "3F",
						"id": 39,
						"type": "floor",
						"uuid": "S000120020039",
						"FQDN_alias": "东莞市政府 行政中心北楼 3F",
						"desc": "",
						"order": 0
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼 1F",
						"score": 21.756945,
						"FQDN": "东莞市政府 行政中心北楼 1F 北楼1F-18",
						"name": "北楼1F-18",
						"id": 1368,
						"type": "room",
						"uuid": "S000120031368",
						"FQDN_alias": "东莞市政府 行政中心北楼 1F 18",
						"desc": "",
						"order": 1368
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼 2F",
						"score": 21.756945,
						"FQDN": "东莞市政府 行政中心北楼 2F 北楼2F-04",
						"name": "北楼2F-04",
						"id": 1369,
						"type": "room",
						"uuid": "S000120031369",
						"FQDN_alias": "东莞市政府 行政中心北楼 2F 04",
						"desc": "",
						"order": 1369
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼 2F",
						"score": 21.756945,
						"FQDN": "东莞市政府 行政中心北楼 2F 北楼2F-05",
						"name": "北楼2F-05",
						"id": 1370,
						"type": "room",
						"uuid": "S000120031370",
						"FQDN_alias": "东莞市政府 行政中心北楼 2F 05",
						"desc": "",
						"order": 1370
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼 2F",
						"score": 21.756945,
						"FQDN": "东莞市政府 行政中心北楼 2F 北楼2F-08",
						"name": "北楼2F-08",
						"id": 1371,
						"type": "room",
						"uuid": "S000120031371",
						"FQDN_alias": "东莞市政府 行政中心北楼 2F 08",
						"desc": "",
						"order": 1371
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼 2F",
						"score": 21.756945,
						"FQDN": "东莞市政府 行政中心北楼 2F 北楼2F-01",
						"name": "北楼2F-01",
						"id": 1372,
						"type": "room",
						"uuid": "S000120031372",
						"FQDN_alias": "东莞市政府 行政中心北楼 2F 01",
						"desc": "",
						"order": 1372
					}, {
						"master_FQDN": "东莞市政府 行政中心北楼 2F",
						"score": 21.756945,
						"FQDN": "东莞市政府 行政中心北楼 2F 北楼2F-02",
						"name": "北楼2F-02",
						"id": 1373,
						"type": "room",
						"uuid": "S000120031373",
						"FQDN_alias": "东莞市政府 行政中心北楼 2F 02",
						"desc": "",
						"order": 1373
					}];

					var results = [];
					for (var i = 0; i < _this.suggested_entities.length; i++) {
						var entity = _this.suggested_entities[i];
						var FQDN = entity.FQDN;
						var value = entity.master_FQDN;
						var id = entity.uuid;
						results.push({
							"value": value,
							"FQDN": FQDN,
							"uuid": id
						});
					}

					console.log(results);
					clearTimeout(this.timeout);
					this.timeout = setTimeout(() => {
						cb(results);
					}, 3000 * Math.random());
				}

			},
			handleCloseTag(entityTag) {
				console.log("remove tag: ", entityTag);
				const idx = entityTag.id;
				this.entityTags.splice(idx, this.entityTags.length - idx);
			},
			handleSelectEntity(entity) {
				console.log('select entity: ' + entity.FQDN);

				this.uuid = entity.uuid;
				//菜单跳转
				this.activeIndex = "1";
				//路由跳转
				this.$router.push({ //核心语句
					path: '/EntityDetail', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						uuid: this.uuid,
					}
				})

				//标签部分，暂时去掉
				// 				var names = entity.FQDN.split(' ');
				// 				console.log("names: ");
				// 				console.log(names);
				// 				this.entityTags.length = 0;
				// 				for (var i = 0; i < names.length; i++) {
				// 					if (names[i]) {
				// 						this.entityTags.push({
				// 							'id': this.entityTags.length,
				// 							'name': names[i]
				// 						});
				// 					}
				// 				}
// 				console.log("entityTags: ");
// 				console.log(this.entityTags);
			},
			getFQDNOfEntityTags() {
				if (this.fullTextBased()) return "";

				var FQDN = '';
				for (var i = 0; i < this.entityTags.length; i++) {
					FQDN += this.entityTags[i].name;
					if (i < this.entityTags.length - 1)
						FQDN += ' ';
				}
				return FQDN;
			},
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
