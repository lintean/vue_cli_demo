<template>
  <section>
    <el-row justify="start">
      <div style="font-size: 14px">支持上传jpg/jpeg/png/gif/bmp/webp类型的文件，且不超过10MB</div>
    </el-row>
    <div style="margin-top: 20px;margin-bottom: 50px;min-height: 250px">
      <div>
        <!--<div>-->
          <!--<form enctype="multipart/form-data" action="upload" method=post target=_blank id="upform">-->
            <!--Choose file:<input name="userfile" type="file">-->
            <!--<br/>-->
            <!--<input type="submit" value="upload" id="bt_submit">-->
          <!--</form>-->
        <!--</div>-->
        <!--:http-request="handleUpload"-->
        <el-col :span="10">
          <el-upload
            ref="upload1"
            :action=uploadImageUrl
            :headers="image_headers"
            multiple
            :limit="imageCountLimit"
            :file-list="fileList"
            list-type="picture"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
            :before-upload="checkImage"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :on-error="handleError"
            :auto-upload="false">
            <!--<div slot="tip" style="font-size: 14px">支持上传jpg/jpeg/png/gif/bmp/webp类型的文件，且不超过10MB</div>-->
            <el-button slot="trigger" size="small" type="primary" style="margin-right: 50px">添加图片</el-button>
            <el-button size="small" type="success" @click="submitUpload" style="marigin-left: 30px">上传图片</el-button>
          </el-upload>
        </el-col>
      </div>
      <div>

      </div>
    </div>

    <div style="margin-top: 50px">
      <div>
        <el-row>
          <el-col :span="6" :offset="2">
            <el-select v-model="imageUUID" placeholder="请输入图片uuid"
                       clearable
                       @change="changeImageUUID"
                       sytle="width: 500px">
              <el-option
                v-for="item in uuid_list"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <!--<el-input v-model="imageUUID" placeholder="" :fetch-suggestion="cacheSearch" style="margin-bottom: 20px"></el-input>-->
          </el-col>
        </el-row>
        <el-row justify="start">
          <img v-if="this.loadImage() === true" :src="this.getImageUrl()">
        </el-row>
      </div>

      <el-dialog :title="imageUUID" :visible.sync="imgVisible" width="35%">
      <img :src="imageUrl" style="width: 200px;">
      <span slot="footer">
      <el-button type="success" @click="imgVisible = false">确定</el-button>
    </span>
    </el-dialog>
    </div>
  </section>
</template>


<script>
  import * as RestAPI from "../api/RestAPI.js"

  export default {
    name: "ImageView",
    data() {
      return {
        uploadImageUrl: RestAPI.imageUploadUrl,
        fetchImageUrl: RestAPI.imageUrl,
        image_headers: {
          // "Content-Type": "multipart/form-data" // 原来用Vue的自动上传，不需要加Content-Type的头部。。
          // "Content-Type": "jpeg"
        },
        imageCountLimit: 3,
        fileList: [],
        imageUUID: null,
        imageUrl: null,
        imgVisible: false,
        uuid_list: [],
        curr_uuids: []
      }
    },
    methods: {
      handleSuccess(response, file, fileList) {
        console.log(response)
        var _this = this;
        var md5_pattern = /MD5:\s*([0-9a-z]+)/
        if(response.search(md5_pattern))
        {
          var match_obj = response.match(md5_pattern);
          console.log(match_obj);
          this.uuid_list.push(match_obj[1]);
          this.curr_uuids.push(match_obj[1]);
          console.log(this.uuid_list);

          // _this.$message({
          //   type: 'success',
          //   message: '上传成功'
          // });
        }else {
          _this.$message.error("上传失败");
        }

        // 文件都上传完了
        if(this.curr_uuids.length === fileList.length)
        {
          console.log(file);
          console.log(fileList);
          console.log(this.uuid_list);

          var msg = "图片uuid：\r\n";
          for(var i = 0; i < this.curr_uuids.length;i++)
            msg += this.curr_uuids[i] + "\n";
          this.$alert(msg, "图片上传成功");
          this.curr_uuids = [];
          this.fileList = [];
        }
        // this.fileList = []
      },
      handleError(err, file, fileList) {
        console.log(err)
        this.$message.error("上传失败")
      },
      handleExceed(file, fileList) {
        this.$message.error("添加图片失败，一次最多只能上传" + this.imageCountLimit + "张图片")
      },
      checkImage(file) {
        const exceedSize = file.size / 1024 / 1024 > 10;
        if (exceedSize) {
          this.$message.error("上传图片大小不能超过10MB");
          return false;
        }
        return true;
      },
      submitUpload() {
        this.$refs.upload1.submit();
      },
      handleUpload() {
        var images = this.fileList;
        console.log("upload images");
        for(var i = 0; i < images.length; i++)
        {
          RestAPI.uploadImage(images[i]).then(res => {
            console.log(res)

          }).catch(err => {
            console.log(err)
          });
        }
      },
      loadImage() {
        // return this.imageUUID != null && this.imageUUID !== "";
        // return imageUUID.length === 16;
        return false;
      },
      getImageUrl() {
        return this.fetchImageUrl + "/" + this.imageUUID;
      },
      cacheSearch(queryString, cb)
      {
        if(queryString == null || queryString === "")
          cb(this.uuid_list);
        else cb(queryString);
      },
      changeImageUUID() {
        this.imageUrl = this.fetchImageUrl + "/" + this.imageUUID;
        this.imgVisible = true;
      }
    }
  }
</script>
