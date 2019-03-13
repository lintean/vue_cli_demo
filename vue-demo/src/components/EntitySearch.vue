<template>
  <div>
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

      <el-col :span="1" style="margin-left: 10px;margin-right: 5px">
        <el-button type="primary" @click="showSearchResults" icon="el-icon-search"
                   :disabled="searchBtnDisabled"></el-button>
      </el-col>

    </el-row>

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
        searchBtnDisabled: true,
        cnCheckBoxDisabled: false,
        // infoBtnDisabled: true,
        searchResults: []
      }
    },
    methods: {
      searchEntityAsync(keyword, cb) {
        var _this = this;

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
              switch (_this.selectedSearchMode) {
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
      handleCloseTag(entityTag) {
        console.log("remove tag: ", entityTag);
        const idx = entityTag.id;
        this.entityTags.splice(idx, this.entityTags.length - idx);
      },
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
