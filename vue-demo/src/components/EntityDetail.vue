<template>
	<el-container style="width: 100%; height: 100%;">
		<el-header style="text-align: center; font-size: 12px; margin-bottom: 10px;">
			<!-- 搜索 -->
			<el-autocomplete v-model="currKeyword" :fetch-suggestions="searchEntityAsync" placeholder="请输入搜索关键字" @select="handleSelectEntity"
			 style="width:400px; top: 10px;" clearable></el-autocomplete>
		</el-header>

		<el-container>
			<el-aside width="400px" style="margin-left: 5px; overflow-x: hidden;">
				<!-- 层次结构 -->
				<div class="all_border">
					<el-row style="text-align: center; margin-bottom: 10px;">
						<el-col style="text-align: center;">层次结构</el-col>
					</el-row>
					<el-row>
						<div id="mynetwork2" ref="network2"></div>
					</el-row>
				</div>

				<!-- 相关结果 -->
				<div class="all_border">
					<el-row style="text-align: center; margin-bottom: 10px;">
						<el-col style="text-align: center;">相关结果</el-col>
					</el-row>
					<el-row v-for="(item, index) in searchCorrelation" :key="index">
						<el-col :offset="2" style="text-align: left;">
							<el-button type="text" @dblclick.native="correlationDBClick(index)">{{index + 1}}、{{item.FQDN}}</el-button>
						</el-col>
					</el-row>
				</div>
				<!-- 最近搜索 -->
				<div class="all_border">
					<el-row style="text-align: center; margin-bottom: 10px;">
						<el-col style="text-align: center;">最近搜索</el-col>
					</el-row>
					<el-row>
						<el-button class="search_history" v-for="(item, index) in searchHistory" type="primary" @dblclick.native="historyDBClick(index)"
						 :key="index">
							{{item.FQDN}}</el-button>
					</el-row>
				</div>
			</el-aside>

			<el-container style="overflow-y: auto; overflow-x: hidden;">
				<!-- 实体信息 -->
				<el-header class="all_border" style="color: #545c64; height: 180px; margin: 0 10px;">
					<el-row style="text-align: center; margin-bottom: 10px;">
						<el-col style="text-align: center;">实体信息</el-col>
					</el-row>
					<el-row>
						<el-col :offset="3">名称：{{name}}</el-col>
					</el-row>
					<el-row>
						<el-col :offset="3">全称：{{FQDN}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="8" :offset="3">类型：{{type}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="8" :offset="3">详情：{{desc}}</el-col>
					</el-row>

				</el-header>

				<el-main class="all_border" style="overflow-x: hidden; padding: 0; margin: 10px 10px 0 10px">
					<!-- 时间选择器 -->
					<el-row>
						<el-date-picker v-model="time" type="daterange" value-format="timestamp" unlink-panels range-separator="至"
						 start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" @change="handleTimeChange"
						 style="margin-top: 20px; margin-bottom: 10px;">
						</el-date-picker>
					</el-row>
					<!-- 柱形图 -->
					<el-row>
						<div class="chart" id="myChart2" ref="bar_chart" style="width: 100%; height: 350px; margin: 0 auto;"></div>
					</el-row>
				</el-main>
			</el-container>
		</el-container>
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
				searchResults: [],
				searchHistory: [],
				suggested_entities: [],
				searchCorrelation: [],

				// 时间选择器的变量
				pickerOptions2: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				time: '',

				// 获取柱形图的控制和临时变量
				energy_type: '1001',
				time_type: 'day',
				energy_detail: [],
				chartXData: [],
				chartYData: [],

				// 层次结果的控制和临沭变量
				node_limit: '',
				hop_limit: '',
				responseData: null,
				res: null,

				// 实体相关的变量,如下是默认值
				uuid: "S000120010005",
				name: "行政中心东楼",
				FQDN: "东莞市政府 行政中心东楼",
				type: "building",
				desc: "",
				types: [{
						type: "project",
						name: "项目"
					},
					{
						type: "building",
						name: "建筑"
					},
					{
						type: "floor",
						name: "楼层"
					},
					{
						type: "room",
						name: "房间"
					},
				]
			};
		},
		// 组件构建时触发
		mounted() {
			//读取本地搜索历史
			if (localStorage.searchHistory) {
				this.searchHistory = JSON.parse(localStorage.searchHistory);
			}

			// 页面重绘（默认已经有实体信息：uuid, name, FQDN, type, desc）
			this.reinit();
		},
		methods: {
			// 异步搜索的网络通讯部分
			searchEntityAsync(keyword, cb) {
				// 将this变为临时变量,以方便在网络回调函数中使用
				var _this = this;

				RestAPI.searchEntity(keyword, _this.size).then(res => {
					console.log(res);
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
				//相关结果清空
				this.searchCorrelation.splice(0, this.searchCorrelation.length);
				//写入相关结果
				for (var i = 0; i < this.suggested_entities.length; ++i) {
					if (entity.uuid != this.suggested_entities[i].uuid) {
						console.log(this.suggested_entities[i]);
						this.searchCorrelation.push(this.suggested_entities[i]);
					}
				}

				//如果是新搜索则记录搜索历史
				var newHistory = true;
				for (var i = 0; i < this.searchHistory.length; ++i) {
					if (this.searchHistory[i].uuid == entity.uuid) {
						newHistory = false;
						break;
					}
				}
				if (newHistory) {
					this.searchHistory.push(entity);
					localStorage.searchHistory = JSON.stringify(this.searchHistory);
				}

				// 更新实体信息
				this.uuid = entity.uuid;
				this.name = entity.name;
				this.FQDN = entity.FQDN;
				this.desc = entity.desc;
				this.type = entity.type;

				// 页面重绘
				this.reinit();
			},
			// 时间选择后，柱形图的网络通讯
			handleTimeChange(newTime) {
				var _this = this;

				//网络通讯
				RestAPI.EntityDetail(this.uuid, this.energy_type, this.time_type, this.time[0].toString(), this.time[1].toString())
					.then(
						res => {
							if (res.data.statusCode === 200) {
								_this.energy_detail = res.data.data.period_data;

								//得到结果后绘制柱形图
								this.drawLine();
							}
						}).catch(err => {
						console.log(err)
					});

			},
			// 绘制柱形图的函数
			drawLine() {
				//根据energy_detail生成chartXData和chartYData
				this.genXYData();

				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(this.$refs.bar_chart);
				// 绘制图表
				myChart.setOption({
					title: {
						text: '历史电量',
						textAlign: 'auto',
						show: false
					},
					// tooltip:提示框组件
					tooltip: {
						axisPointer: {
							//指示器类型: 阴影指示器
							type: 'shadow'
						}
					},
					// dataZoom 组件 用于区域缩放
					dataZoom: [{
						//  inside：平移,在坐标系中滑动拖拽进行数据区域平移
						//           [通过手指可放大放小]
						//  slider：滑动条型数据区域缩放组件
						//           [通过下方滑动条放大放小]
						type: 'inside'
					}],
					xAxis: {
						type: 'category',
						data: this.chartXData
					},
					yAxis: {
						type: 'value',
						splitArea: {
							show: true
						}
					},
					series: [{
						name: '用电量',
						type: "bar",
						data: this.chartYData
					}]
				});
			},
			// 根据服务器的结果生成x轴和y轴的坐标
			genXYData() {
				this.chartXData = [];
				this.chartYData = [];

				var data = this.energy_detail;
				for (var i = 0; i < data.length; ++i) {
					var date = new Date(data[i].run_at);
					this.chartXData.push(date.toLocaleDateString());
					this.chartYData.push(data[i].value);
				}
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
						'title': response.entity_node[i].FQDN
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
				var container = this.$refs.network2;
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
							size: 16
						},
						shadow: true,
						heightConstraint: 30
					}
				};

				var network = new vis.Network(container, data, options);

				// 监听层次结构节点的双击事件
				var _this = this;
				network.on("doubleClick", function(params) {
					//相关结果清空
					_this.searchCorrelation.splice(0, _this.searchCorrelation.length);

					for (var i = 0; i < _this.res.entity_node.length; ++i) {
						if (_this.res.entity_node[i].aid == params.nodes[0]) {
							//双击访问对应节点的信息
							_this.uuid = _this.res.entity_node[i].uuid;
							_this.name = _this.res.entity_node[i].name;
							_this.FQDN = _this.res.entity_node[i].FQDN;
							_this.desc = _this.res.entity_node[i].desc;
							_this.type = _this.res.entity_node[i].type;
						} else {
							//写入相关结果
							_this.searchCorrelation.push(_this.res.entity_node[i]);
						}
					}

					// 页面重绘
					_this.reinit();
				});
			},
			reinit() {
				// 页面重绘大致分为三个部分:1将type类型转换为中文 2柱形图重绘 3层次结构重绘
				//将type类型转换为中文
				for (var i = 0; i < this.types.length; ++i) {
					if (this.types[i].type == this.type) this.type = this.types[i].name;
				}

				//柱形图重绘
				//触发一次时间改变，设置默认值事件
				const start = 1530374400000;
				const end = 1538323200000;
				this.time = [start, end];
				this.handleTimeChange();

				//层次结构重新加载
				this.reset();
			},
			//监听相关结果的双击事件
			correlationDBClick(index) {
				//双击后更新实体信息，然后重绘页面
				var entity = this.searchCorrelation[index];

				this.uuid = entity.uuid;
				this.name = entity.name;
				this.FQDN = entity.FQDN;
				this.desc = entity.desc;
				this.type = entity.type;

				this.reinit();
			},
			//监听搜索历史的双击事件
			historyDBClick(index) {
				//双击后更新实体信息，然后重绘页面
				var entity = this.searchHistory[index];
				
				// 更新实体信息
				this.uuid = entity.uuid;
				this.name = entity.name;
				this.FQDN = entity.FQDN;
				this.desc = entity.desc;
				this.type = entity.type;
				
				// 页面重绘
				this.reinit();
			}
		}
	};
</script>

<style>
	#mynetwork2 {
		width: 24.375rem;
		height: 300px;
	}

	.all_border {
		border: 1px solid lightgray;
		padding: 5px;
		margin-bottom: 10px;
	}

	.el-header>.el-row>.el-col {
		height: 30px;
		font-size: 23px;
		text-align: left;
	}

	.search_history {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		margin-left: 10px;
		margin-top: 5px;
	}
</style>
