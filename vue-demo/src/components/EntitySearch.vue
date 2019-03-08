<template>
  <div>
    <el-container>
      <el-header>
        <el-row style="min-height: 45px">
          <el-col :offset="5">
            <div align="left">
              <el-tag v-for="entityTag in entityTags"
                      :key="entityTag.name"
                      closable
                      @close="handleCloseTag(entityTag)" style="margin:5px">
                {{entityTag.name}}
              </el-tag>
            </div>
          </el-col>
        </el-row>
				
        <el-row :gutter="0" style="margin-top: 10px">
            <el-col :span="6" :offset="5">
              <el-autocomplete
                v-model="currKeyword"
                :fetch-suggestions="searchEntityAsync"
								:trigger-on-focus="false"
                placeholder="请输入搜索关键字"
                @select="handleSelectEntity"
                style="width:400px"
                clearable
              ></el-autocomplete>
            </el-col>
						
          <el-col :span="1" style="margin-left: 80px;margin-right: 5px">
            <el-button type="primary" @click="getEntityInfo" icon="el-icon-info"></el-button>
              <!--:disabled="infoBtnDisabled"></el-button>-->
          </el-col>
					
          <el-col :span="1" style="margin-left: 10px;margin-right: 5px">
            <el-button type="primary" @click="showSearchResults" icon="el-icon-search"
                       :disabled="searchBtnDisabled"></el-button>
          </el-col>
					
          <el-col :span="2" style="margin-left: 10px;margin-right: 5px">
            <el-select v-model="selectedSearchMode" placeholder="搜索模式"
                       @change="changeSearchMode">
              <el-option v-for="item in searchModes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
					
          <el-col :span="1" style="margin-left:10px">
            <el-checkbox v-model="cn" border :disabled="cnCheckBoxDisabled">中文分词</el-checkbox>
          </el-col>
					
        </el-row>
      </el-header>
      
			<el-main>
        <div align="center">
          <el-card class="result-card" v-for="result in searchResults">
            <div slot="header" class="result-header">
              <span>{{result.FQDN}}</span>
            </div>
            <div>
              <span >{{result.desc}}</span>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>

  <el-dialog title="实体信息" :visible.sync="selectedEntityDialogVisible" width="35%">
    <el-form ref="selectedEntity" :model="selectedEntity" label-width="80px" style="margin-bottom: 5px">
      <el-form-item label="uuid">
        <div align="left">
          <span>{{selectedEntity.uuid}}</span>
        </div>
      </el-form-item>
      <el-form-item label="实体类型">
        <div align="left">
        <span>{{selectedEntity.type}}</span>
        </div>
      </el-form-item>
      <el-form-item label="实体名称">
        <div align="left">
        <span>{{selectedEntity.name}}</span>
        </div>
      </el-form-item>
      <el-form-item label="实体全称">
        <div align="left">
        <span>{{selectedEntity.FQDN}}</span>
        </div>
      </el-form-item>
      <el-form-item label="实体描述">
        <div align="left">
        <span>{{selectedEntity.desc}}</span>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="success" @click="checkEntityInfo">确定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
  import * as RestAPI from '../api/RestAPI'

  export default {
    name: "EntitySearch",
    data() {
      return {
        selectedSearchMode: "full-text",
        currKeyword: '主楼 19F',
        cn: false,
        size: 10,

        fullText_FQDN: "",
        suggested_entities: [],
        entityTags: [],
        selectedEntity: {
          'name': '',
          'FQDN': ''
        },
        selectedEntityDialogVisible: false,

        searchModes: [
          {
            value: 'full-text-primitive',
            label: '全文搜索'
          },
          {
            value: "full-text",
            label: "全文优化"
          },
          {
            value: 'filter',
            label: '层次搜索'
          },
          {
            value: 'prefix',
            label: '前缀搜索'
          },
          {
            value: 'desc',
            label: '详情搜索'
          },
          {
            value: "debug",
            label: "测试优化"
          }
        ],
        searchBtnDisabled: true,
        cnCheckBoxDisabled: false,
        // infoBtnDisabled: true,
        searchResults: []
      }
    },
    methods: {
      searchEntityAsync(keyword, cb) {
        var _this = this;
        // if(this.selectedSearchMode === "debug")
        // {
        //   RestAPI.debugSearchEntity(keyword, _this.size).then(res => {
        //     console.log("elasticsearch result: ", res);
        //     if(res.data.hits.hits.length > 0){
        //       let hits = res.data.hits.hits;
        //       var results = [];
        //       for(var i = 0; i < hits.length; i++)
        //       {
        //         results.push({
        //           "value": hits[i]._source.FQDN,
        //           "FQDN": hits[i]._source.FQDN
        //         })
        //       }
        //       cb(results);
        //     }
        //   }).catch(err => {
        //     console.log(err);
        //   });
        //   return;
        // }

        var master_FQDN = this.getFQDNOfEntityTags();

        RestAPI.searchEntity(_this.selectedSearchMode, keyword, master_FQDN, _this.size, _this.cn).then(res => {
          console.log(res);
          if (res.data.statusCode === 200) {
            _this.suggested_entities = res.data.data;
            console.log("suggested_entities");
            console.log(_this.suggested_entities);

            var results = [];
            for (var i = 0; i < _this.suggested_entities.length; i++) {
              var entity = _this.suggested_entities[i];
                var FQDN = entity.FQDN;
                var value = "";
                switch (_this.selectedSearchMode)
                {
                  case "filter":
                    value = entity.name;
                    break;
                  case "prefix":
                    value = master_FQDN === "" ? FQDN : FQDN.substring(master_FQDN.length + 1);
                    break;
                  default:
                    value = entity.FQDN;
                    break;
                }

                // console.log("master_FQDN: ", master_FQDN);
                // console.log("value: ", value);
                results.push({
                  "value": value,
                  "FQDN": FQDN
                });
            }
            console.log("results:")
            console.log(results);
            cb(results);
          }
        }).catch(err => {
          console.log(err)
        });
      },
      changeSearchMode() {
        if (this.selectedSearchMode === 'desc')
          this.searchBtnDisabled = false;
        else {
          this.searchBtnDisabled = true;
          this.searchResults.length = 0;
        }

        if(this.fullTextBased()) {
          this.entityTags.length = 0;
        }

        if(this.selectedSearchMode === "full-text")
        {
          this.cn = false;
          this.cnCheckBoxDisabled = true;
        }else{
          this.cnCheckBoxDisabled = false;
        }

        // console.log("change to mode: " + this.selectedSearchMode);
      },
      handleSelectEntity(entity) {
        console.log('select entity: ' + entity.FQDN);

        // if(this.selectedSearchMode === 'full-text') return;

        if(this.fullTextBased()) {
          this.fullText_FQDN = entity.FQDN;
          this.getEntityInfo();
          return;
        }

        // var names = trim(entity.FQDN).split(' ');
        var names = entity.FQDN.split(' ');
        console.log("names: ");
        console.log(names);
        this.entityTags.length = 0;
        for (var i = 0; i < names.length; i++) {
          if(names[i])
          {
            this.entityTags.push({
              'id': this.entityTags.length,
              'name': names[i]
            });
          }
        }

        this.currKeyword = '';
        console.log("entityTags: ");
        console.log(this.entityTags);
      },
      handleCloseTag(entityTag) {
        console.log("remove tag: ", entityTag);
        const idx = entityTag.id;
        this.entityTags.splice(idx, this.entityTags.length - idx);
      },
      showSearchResults() {
        this.searchResults = this.suggested_entities.concat();
      },
      getEntityInfo() {
        var _this = this;
        var FQDN = this.currKeyword;
        if(!this.fullTextBased() && this.entityTags.length > 0)
          FQDN = this.getFQDNOfEntityTags();

          // this.fullText_FQDN : this.getFQDNOfEntityTags();
        console.log("FQDN: ", FQDN);
        if (!FQDN || FQDN === "") {
          this.$message.error("请选择实体");
          return;     
        }

        // RestAPI.getEntityByFQDN(FQDN).then( res => {
        //   console.log(res);
        //   if(res.data.statusCode === 200)
        //   {
        //       _this.selectedEntity = res.data.data;
        //     if(_this.selectedEntity)
        //     _this.selectedEntityDialogVisible = true;
        //     else
        //     {
        //       _this.$message.error("找不到实体：\"" + FQDN + "\"");
        //     }
        //   }
        // }).catch( err => {
        //   console.log(err);
        // });

      },
      // getFQDN(entity) {
      //   if (entity.type === 'project')
      //     return entity.name;
      //   return entity.master_FQDN + ' ' + entity.name;
      // },
      getFQDNOfEntityTags() {
        if(this.fullTextBased()) return "";

        var FQDN = '';
        for (var i = 0; i < this.entityTags.length; i++) {
          FQDN += this.entityTags[i].name;
          if (i < this.entityTags.length - 1)
            FQDN += ' ';
        }
        return FQDN;
      },
      checkEntityInfo() {
        this.selectedEntityDialogVisible = false;
        // this.fullText_FQDN = "";
      },
      fullTextBased() {
        return !(this.selectedSearchMode === "filter" || this.selectedSearchMode === "prefix");
      }
    }
  }

</script>

<style scoped>
  .result-card {
    width: 540px;
    margin: 40px;
    align-self: center;
  }
  .result-header {
    height: 20px;
    /*font-size: 14px;*/
  }
  .el-form-item {
    margin: 0;
  }
</style>
