<template>
	<el-container style="width: 100%; height: 100%;">
		<el-header style="text-align: center; font-size: 12px; margin-bottom: 10px;">
			<!-- 搜索 -->
			<el-autocomplete v-model="currKeyword" :fetch-suggestions="searchEntityAsync" placeholder="请输入搜索关键字" @select="handleSelectEntity"
			 style="width:400px; top: 10px;" clearable></el-autocomplete>
		</el-header>

		<el-main style="padding: 0;">
			<!-- 节点和深度选择，以及实体全称 -->
			<el-row style="margin-bottom: 10px;" :gutter="2">
				<el-col :span="2" :offset="1" style="height: 40px; line-height: 40px;">
					节点上限
				</el-col>
				<el-col :span="3">
					<el-select v-model="node_limit" placeholder="节点数量上限" @change="reset">
						<el-option v-for="item in node_limits" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="2" style="height: 40px; line-height: 40px;">
					最大深度
				</el-col>
				<el-col :span="3">
					<el-select v-model="hop_limit" placeholder="节点深度上限" @change="reset">
						<el-option v-for="item in hop_limits" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="7" style="height: 40px; line-height: 40px;">
					全称：{{FQDN}}
				</el-col>
			</el-row>

			<!-- 层次结构 -->
			<el-row style="width: 100%; overflow: hidden;">
				<el-col :offset="1">
					<div id="mynetwork" ref="network"></div>
				</el-col>
			</el-row>
		</el-main>

	</el-container>
</template>

<script>
	import * as RestAPI from '../api/RestAPI'

	export default {
		data() {
			return {
				// 搜索相关的变量
				currKeyword: '',
				size: 10,
				suggested_entities: [],

				// 实体相关的变量
				uuid: "S000120010005",
				FQDN: "东莞市政府 行政中心东楼",

				// 层次结构的控制和临时变量
				node_limits: [{
					value: '5',
					label: '5'
				}, {
					value: '10',
					label: '10'
				}, {
					value: '20',
					label: '20'
				}, {
					value: '50',
					label: '50'
				}],
				node_limit: '',
				hop_limits: [{
					value: '1',
					label: '1'
				}, {
					value: '2',
					label: '2'
				}, {
					value: '5',
					label: '5'
				}, {
					value: '8',
					label: '8'
				}],
				hop_limit: '',
				responseData: null,
				res: null
			}
		},
		mounted() {
			// 组件加载时进行层次结构重绘
			this.reset();
		},
		methods: {
			// 异步搜索的网络通讯部分
			searchEntityAsync(keyword, cb) {
				// 将this变为临时变量,以方便在网络回调函数中使用
				var _this = this;

				RestAPI.searchEntity(keyword, _this.size).then(res => {
					if (res.data.statusCode === 200) {
						_this.suggested_entities = res.data.data;

						var results = [];
						for (var i = 0; i < _this.suggested_entities.length; i++) {
							var entity = _this.suggested_entities[i];
							var FQDN = entity.FQDN;
							var value = entity.master_FQDN;
							var id = entity.uuid;
							var name = entity.name;
							var FQDN = entity.FQDN;
							var desc = entity.desc;
							var type = entity.type;
							results.push({
								"value": value,
								"FQDN": FQDN,
								"uuid": id,
								"name": name,
								"type": type,
								"desc": desc
							});
						}
						// 返回结果数组,以便在组件中显示出来
						cb(results);
					}
				}).catch(err => {
					console.log(err)
				});
			},
			// 选中搜索后的监听函数
			handleSelectEntity(entity) {
				// 更新实体信息
				this.uuid = entity.uuid;
				this.FQDN = entity.FQDN;

				// 层次结构重绘
				this.reset();
			},
			// 层次结构的网络通讯
			getData() {
				var _this = this;
				RestAPI.EntityNetwork(this.uuid, this.hop_limit, this.node_limit).then(res => {
					if (res.data.msg === "OK") {
						_this.res = res.data.data;
						_this.responseData = _this.changeResponse(res.data.data);
						_this.redraw();
					}
				}).catch(err => {
					console.log(err);
				});
			},
			// 根据服务器的结果生成点和边
			changeResponse(response) {
				// 生成点
				var nodes = new vis.DataSet();
				for (var i = 0, len = response.entity_node.length; i < len; ++i) {
					nodes.add({
						'id': response.entity_node[i].aid,
						'label': response.entity_node[i].name,
						'title': response.entity_node[i].FQDN,
						'uuid': response.entity_node[i].uuid,
						'desc': response.entity_node[i].desc,
						'type': response.entity_node[i].type
					})
				}


				// 生成边
				var edges = new vis.DataSet();
				for (var i = 0, len = response.entity_graph.length; i < len; ++i) {
					for (var j = 0; j < response.entity_graph[i].adj_nodes_aid.length; ++j) {

						if (response.entity_graph[i].adj_nodes_aid[j] > response.entity_graph[i].node_aid) {
							edges.add({
								'from': response.entity_graph[i].node_aid,
								'to': response.entity_graph[i].adj_nodes_aid[j],
							})
						}

					}
				}

				var data = {
					nodes: nodes,
					edges: edges
				};

				return data;
			},
			// 层次结构重绘函数（换一个更有意义的名字）
			reset() {
				this.getData();
			},
			// 绘制层次结构的函数
			redraw() {
				var data = this.responseData;

				// 生成层次结构
				var container = this.$refs.network;
				var options = {
					autoResize: true,
					height: '100%',
					width: '100%',
					interaction: {
						hover: true
					},
					nodes: {
						color: '#FFC454',
						scaling: {
							label: true
						},
						font: {
							size: 16,
						},
						shape: 'ellipse',
						shadow: true,
						heightConstraint: 30
					}
				};

				var network = new vis.Network(container, data, options);

				// 监听层次结构节点的双击事件
				var _this = this;
				network.on("doubleClick", function(params) {
					for (var i = 0; i < _this.res.entity_node.length; ++i) {
						if (_this.res.entity_node[i].aid == params.nodes[0]) {
							// 更新实体信息
							_this.uuid = _this.res.entity_node[i].uuid;
							_this.FQDN = _this.res.entity_node[i].FQDN;

							// 层次结构重绘
							_this.reset();
						}
					}
				});
			}
		}
	};
</script>

<style>
	#mynetwork {
		width: 1000px;
		height: 450px;
		border: 1px solid lightgray;
	}
</style>
