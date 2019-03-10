<template>
	<el-container style="width: 100%; height: 100%;">
		<el-aside width="400px">
			<div id="mynetwork2" ref="network2"></div>
		</el-aside>
		<el-container>
			<el-header style="color: #545c64; border-bottom: 1px solid #eff2f6; height: 140px;">
				<el-row style="text-align: center; margin-bottom: 10px;">
					<el-col style="text-align: center;">实体信息</el-col>
				</el-row>
				<el-row>
					<el-col :offset="3">名称：{{name}}</el-col>
				</el-row>
				<el-row>
					<el-col :offset="3">全称：{{full_name}}</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" :offset="3">类型：{{entity_type}}</el-col>
					<el-col :span="8" :offset="5">详情：{{entity_detail}}</el-col>
				</el-row>
			</el-header>
			<el-main style="overflow-y: hidden; padding: 0; margin-top: 10px;">
				<el-row>
					<el-date-picker v-model="time" type="daterange" value-format="timestamp" unlink-panels range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" @change="handleTimeChange">
					</el-date-picker>
				</el-row>

				<el-row>
					<div class="chart" id="myChart2"></div>
				</el-row>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import * as RestAPI from '../api/RestAPI'

	export default {
		data() {
			return {
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
				energy_type: '1001',
				time_type: 'day',
				energy_detail: [],
				chartXData: [],
				chartYData: [],
				uuid: "S000120010005",
				node_limit: '',
				hop_limit: '',
				responseData: null,
				res: null,
				name: "实体名称",
				full_name: "实体全称",
				entity_type: "实体类型",
				entity_detail: "实体详情",
				types: [{
						entity_type: "project",
						name: "项目"
					},
					{
						entity_type: "building",
						name: "建筑"
					},
					{
						entity_type: "floor",
						name: "楼层"
					},
					{
						entity_type: "room",
						name: "房间"
					},
				]
			};
		},
		mounted() {
			//生成时触发默认时间
			this.updateUuid();
			//图重新加载
			this.reset();
		},
		methods: {
			handleTimeChange(newTime) {
				// 			console.log(newTime);
				console.log(this.time);
				// console.log(this.time[0]);
				var id = null;
				var _this = this;
				id = this.uuid;


				//这里是因跨域而暂时不用的网络通讯
				RestAPI.EntityDetail(id, this.energy_type, this.time_type, this.time[0].toString(), this.time[1].toString()).then(
					res => {
						console.log(res);
						if (res.data.statusCode === 200) {
							_this.energy_detail = res.data.data.period_data;

							//getTestData函数是放弃网络通讯之后，得到虚拟数据的函数,若启用网络通讯，请把此处注释掉
							// this.getTestData();
							//绘制图表的函数
							this.drawLine();
						}
					}).catch(err => {
					console.log(err)
				});

			},
			drawLine() {
				console.log("图表重绘");
				//根据energy_detail生成chartXData和chartYData
				this.genXYData();

				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChart2'))
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
			getTestData() {
				this.energy_detail = {
					"statusCode": 200,
					"msg": "OK",
					"data": {
						"time_type": "day",
						"period_data": [{
								"run_at": 1495728000000,
								"value": 6.900000000000091,
								"last_rate": 0.1695,
								"circle_rate": -0.08
							},
							{
								"run_at": 1495814400000,
								"value": 6.099999999999909,
								"last_rate": -0.1159,
								"circle_rate": 0.6053
							},
							{
								"run_at": 1495900800000,
								"value": 0.7000000000002728,
								"last_rate": -0.8852,
								"circle_rate": -0.7667
							},
							{
								"run_at": 1495987200000,
								"value": 0.6999999999998181,
								"last_rate": 0,
								"circle_rate": -0.8889
							},
							{
								"run_at": 1496073600000,
								"value": 0.6999999999998181,
								"last_rate": 0,
								"circle_rate": -0.8409
							},
							{
								"run_at": 1496160000000,
								"value": 6.5,
								"last_rate": 8.2857,
								"circle_rate": 0.0484
							},
							{
								"run_at": 1496246400000,
								"value": 5.600000000000364,
								"last_rate": -0.1385,
								"circle_rate": -0.0508
							}
						]
					}
				}
			},
			genXYData() {
				this.chartXData = [];
				this.chartYData = [];

				console.log(this.energy_detail);
				var data = this.energy_detail;
				for (var i = 0; i < data.length; ++i) {
					var date = new Date(data[i].run_at);
					this.chartXData.push(date.toLocaleDateString());
					this.chartYData.push(data[i].value);
				}
			},
			updateUuid() {
				this.uuid = this.$route.query.uuid; //接受参数关键代码
				this.name = this.$route.query.name;
				this.full_name = this.$route.query.full;
				this.entity_type = this.$route.query.type;
				this.entity_detail = this.$route.query.desc;
				console.log("接受参数：" + this.uuid);
				
				//更新类型
				for (var i = 0; i < this.types.length; ++i){
					if (this.types[i].entity_type == this.entity_type) this.entity_type = this.types[i].name;
				}

				//触发一次时间改变，默认为最近一周
				const start = 1530374400000;
				const end = 1538323200000;
				this.time = [start, end];
				this.handleTimeChange();
				this.reset();
			},
			getData() {
				var _this = this;
				var response = null;
				RestAPI.EntityNetwork(this.uuid, this.hop_limit, this.node_limit).then(res => {
					console.log("receive network data:");
					console.log(res);
					// if(res.data.status === 200)
					if (res.data.msg === "OK") {
						response = res.data.data;
						console.log("OK");
						_this.res = res.data.data;
						_this.responseData = _this.changeResponse(res.data.data);
						_this.redraw();
					}
				}).catch(err => {
					console.log(err);
				});
			},
			changeResponse(response) {
				// create an array with nodes
				var nodes = new vis.DataSet();
				for (var i = 0, len = response.entity_node.length; i < len; ++i) {
					nodes.add({
						'id': response.entity_node[i].aid,
						'label': response.entity_node[i].name,
						'title': response.entity_node[i].FQDN
					})
				}


				// create an array with edges
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
			//重绘函数
			reset() {
				this.getData();
			},
			redraw() {
				var data = this.responseData;

				// create a network
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
						shape: 'circle',
						shadow: true,
						heightConstraint: 30
					}
				};

				var network = new vis.Network(container, data, options);

				//bind event
				network.on("hoverNode", function(params) {
					// console.log('hoverNode Event:', params);
				});
				
				var _this = this;
				network.on("doubleClick", function(params) {
					for (var i = 0; i < _this.res.entity_node.length; ++i) {
						if (_this.res.entity_node[i].aid == params.nodes[0]) {
							console.log('hoverNode Event:', _this.res.entity_node[i]);
							
							
				
							//路由跳转
							_this.$parent.$router.push({ //核心语句
								path: '/EntityDetail', //跳转的路径
								query: { //路由传参时push和query搭配使用 ，作用时传递参数
									uuid: _this.res.entity_node[i].uuid,
									name: _this.res.entity_node[i].name,
									full: _this.res.entity_node[i].FQDN,
									desc: _this.res.entity_node[i].desc,
									type: _this.res.entity_node[i].type
								}
							})
						}
					}
				});
			}
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'updateUuid'
		}
	};
</script>

<style>
	#myChart2 {
		width: 100%;
		height: 350px;
		margin: 0 auto;
	}

	#mynetwork2 {
		width: 24.375rem;
		height: 95%;
		border: 1px solid lightgray;
	}

	.el-header>.el-row>.el-col {
		height: 30px;
		font-size: 23px;
		text-align: left;
	}
</style>
