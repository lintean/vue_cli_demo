<template>
	<div>
		<el-row style="margin-bottom: 10px; margin-top: 20px;">
			<el-date-picker v-model="time" type="daterange" value-format="timestamp" unlink-panels range-separator="至"
			 start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" @change="handleTimeChange">
			</el-date-picker>
		</el-row>

		<el-row>
			<div class="chart" id="myChart"></div>
		</el-row>

	</div>
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
				uuid: null
			};
		},
		mounted() {
			//生成时触发默认时间
			this.updateUuid();
		},
		methods: {
			handleTimeChange(newTime) {
				// 			console.log(newTime);
				// 			console.log(this.time);
				var id = null;
				if (!this.uuid || this.uuid == "") id = "S000120030806";
				else id = this.uuid;

				//这里是因跨域而暂时不用的网络通讯
				// 				RestAPI.EntityDetail(id, this.energy_type, this.time_type, this.time[0], this.time[1]).then(res => {
				// 					console.log(res);
				// // 					if (res.data.statusCode === 200) {
				// // 						_this.suggested_entities = res.data.data;
				// // 						console.log("suggested_entities");
				// // 						console.log(_this.suggested_entities);
				// // 
				// // 					}
				// 				}).catch(err => {
				// 					console.log(err)
				// 				});

				//getTestData函数是放弃网络通讯之后，得到虚拟数据的函数,若启用网络通讯，请把此处注释掉
				this.getTestData();
				//绘制图表的函数
				this.drawLine();
			},
			drawLine() {
				console.log("图表重绘");
				//根据energy_detail生成chartXData和chartYData
				this.genXYData();
				
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChart'))
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
			getTestData(){
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
			genXYData(){
				this.chartXData = [];
				this.chartYData = [];
				
				var data = this.energy_detail.data.period_data;
				for (var i = 0; i < data.length; ++i){
					var date = new Date(data[i].run_at);
					this.chartXData.push(date.toLocaleDateString());
					this.chartYData.push(data[i].value);
				}
			},
			updateUuid(){
				this.uuid = this.$route.query.uuid;  //接受参数关键代码
				console.log("接受参数：" + this.uuid);
				
				//触发一次时间改变，默认为最近一周
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
				this.time = [start, end];
				this.handleTimeChange()
			}
		},
		watch: {
          // 如果路由有变化，会再次执行该方法
          '$route': 'updateUuid'
        }
	};
</script>

<style>
	#myChart {
		width: 1000px;
		height: 500px;
		margin: 0 auto;
	}
</style>
