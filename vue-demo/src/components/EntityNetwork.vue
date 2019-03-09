<template>
	<div style="width:100%; height:100%; position: relative;">
	    <div id="mynetwork" ref="network"></div>
	</div>
</template>

//此处的网络通讯使用jquery（懒得改了）
<script>	
	import * as RestAPI from '../api/RestAPI'
	export default {
		data() {
			return {
				uuid: "S000120030008"
			}
		},
		mounted(){
			this.reset();
		},
		methods:{
			
			getData(){
				var _this = this;
				var response = null;
				RestAPI.EntityNetwork(this.uuid).then(res => {
					console.log("receive network data:");
					console.log(res);
					// if(res.data.status === 200)
					if(res.data.msg === "OK")
					{
						response = res.data.data;
						console.log("OK");
						console.log(response);
						return _this.changeResponse(res.data.data);
					}
				}).catch(err => {
					console.log(err);
				});

				console.log("network data:");
				console.log(response);

				//拟定返回值,后台返回请使用相同格式的json
				// var response = {
				//     "entity_node": [
				//         {
				//             "aid": 1,
				//             "name": "虾饺",
				//             "desc": "虾饺是广东地区著名的传统小吃，属粤菜系。味道鲜美爽滑，美味可口。"
				//         },
				//         {
				//             "aid": 2,
				//             "name": "伍村",
				//             "desc": "广州伍村，虾饺的发源地。"
				//         },
				//         {
				//             "aid": 3,
				//             "name": "粤菜",
				//             "desc": "粤菜即广东菜，是中国传统四大菜系、八大菜系之一，发源于岭南。"
				//         },
				//         {
				//             "aid": 4,
				//             "name": "茶居",
				//             "desc": "饮茶的店铺"
				//         },
				//         {
				//             "aid": 5,
				//             "name": "水晶虾饺",
				//             "desc": "水晶虾饺是传统粤式茶楼点心之一，与干蒸烧卖、叉烧包、蛋挞齐名的传统名点小吃……"
				//         },
				//         {
				//             "aid": 6,
				//             "name": "早茶点心",
				//             "desc": "广东早茶是一种岭南民间饮食风俗。早茶点心是早茶中特有的点心。"
				//         },
				//         {
				//             "aid": 7,
				//             "name": "干蒸烧卖",
				//             "desc": "干蒸烧卖是广东省地方传统名点，广式饮茶中的干蒸烧卖是茶市必点的人气点心之一。"
				//         },
				//         {
				//             "aid": 8,
				//             "name": "叉烧包",
				//             "desc": "叉烧包是广东地区具有代表性的特色传统西关名点之一，是粤式早茶的“四大天王（虾饺、干蒸烧卖、叉烧包、蛋挞）”之一。"
				//         }
					
				//     ],
				//     "entity_graph": [
				//             {
				//                 "node_aid": 1,
				//                 "adj_nodes_aid": [2, 3, 4, 5, 6]
				//             },
				//             {
				//                 "node_aid": 2,
				//                 "adj_nodes_aid": [1]
				//             },
				//             {
				//                 "node_aid": 3,
				//                 "adj_nodes_aid": [1]
				//             },
				//             {
				//                 "node_aid": 4,
				//                 "adj_nodes_aid": [1]
				//             },
				//             {
				//                 "node_aid": 5,
				//                 "adj_nodes_aid": [1, 6]
				//             },
				//             {
				//                 "node_aid": 6,
				//                 "adj_nodes_aid": [1, 5, 7, 8]
				//             },
				//             {
				//                 "node_aid": 7,
				//                 "adj_nodes_aid": [6]
				//             },
				//             {
				//                 "node_aid": 8,
				//                 "adj_nodes_aid": [6]
				//             }
				//     ]
				// }
					
				//网络通讯
				// $.ajax({
				//         url:"http://....",
				//         type:"GET",
				//         data:null,
				//         dataType:"json",
				//         success:function(data){
				//             response = data;
				//         },
				//         error:function(data){
				//             console.log(data);
				//         }
				//     })
					
				
					
				return this.changeResponse(response);
			},
			changeResponse(response){
				// create an array with nodes
				var nodes = new vis.DataSet();
				for (var i = 0, len = response.entity_node.length; i < len; ++i){
				    nodes.add({
				        'id': response.entity_node[i].aid,
				        'label': response.entity_node[i].name,
				        'title': response.entity_node[i].desc
				    })
				}
				
					
				// create an array with edges
				var edges = new vis.DataSet();
				for (var i = 0, len = response.entity_graph.length; i < len; ++i){
				    for (var j = 0; j < response.entity_graph[i].adj_nodes_aid.length; ++j){
					
				        if (response.entity_graph[i].adj_nodes_aid[j] > response.entity_graph[i].node_aid){
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
			updateUuid(){
				this.uuid = this.$route.query.uuid;  //接受参数关键代码
				console.log("接受参数：" + this.uuid);
				
				//触发重绘
				this.reset();
			},
			//重绘函数
			reset(){
				var data = this.getData();
				// create a network
				var container = this.$refs.network;
				var options = {
				        autoResize: true,
				        height: '100%',
				        width: '100%',
						interaction:{hover:true},
				        nodes:{
				            color: '#FFC454',
				            scaling: {
				                label: true
				            },
				            font: {
				                size: 16
				            },
				            shape: "circle",
				            shadow: true
				        }
					};
				
				var network = new vis.Network(container, data, options);
				
				//bind event
				network.on("hoverNode", function (params) {
				    // console.log('hoverNode Event:', params);
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
	#mynetwork {
	    width: 100%;
	    height: 100%;
	    border: 1px solid lightgray;
	}
</style>
