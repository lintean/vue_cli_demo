<template>
  <div>
    <el-row style="margin-bottom: 10px; margin-top: 20px;" :gutter="2" :align="middle">
      <!--<el-col :span="2" :offset="1">-->
        <!--<span>节点数量上限</span>-->
      <!--</el-col>-->
      <el-col :span="3" :offset="1">
        <el-select v-model="node_limit" placeholder="节点数量上限" @change="reset">
          <el-option v-for="item in node_limits" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <!--<el-col :span="2">-->
        <!--<span>节点深度上限</span>-->
      <!--</el-col>-->
      <el-col :span="3" :offset="1">
        <el-select v-model="hop_limit" placeholder="节点深度上限" @change="reset">
          <el-option v-for="item in hop_limits" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row style="width: 100%; overflow: hidden;">
      <el-col :offset="1">
        <div id="mynetwork" ref="network"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as RestAPI from '../api/RestAPI'

  export default {
    data() {
      return {
        uuid: "S000120010005",
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
      this.reset();
    },
    methods: {

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


      },
      changeResponse(response) {
        // create an array with nodes
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
      updateUuid() {
        this.uuid = this.$route.query.uuid; //接受参数关键代码
        console.log("接受参数：" + this.uuid);

        //触发重绘
        this.reset();
      },
      //重绘函数
      reset() {
        this.getData();
      },
      redraw() {
        var data = this.responseData;

        // create a network
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
            shape: 'circle',
            shadow: true,
            heightConstraint: 30
          }
        };

        var network = new vis.Network(container, data, options);

        //bind event
        network.on("hoverNode", function (params) {
          // console.log('hoverNode Event:', params);
        });

        var _this = this;
        network.on("doubleClick", function (params) {
          for (var i = 0; i < _this.res.entity_node.length; ++i) {
            if (_this.res.entity_node[i].aid == params.nodes[0]) {
              console.log('hoverNode Event:', _this.res.entity_node[i]);

              //菜单跳转：目前有bug不可用

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
  #mynetwork {
    width: 1000px;
    height: 450px;
    border: 1px solid lightgray;
  }
</style>
