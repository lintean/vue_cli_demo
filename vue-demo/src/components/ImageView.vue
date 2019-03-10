<template>
  <section>
    <el-row justify="start">
      <div style="font-size: 14px">支持上传jpg/jpeg/png/gif/bmp/webp类型的文件，且不超过10MB</div>
    </el-row>
    <div style="margin-top: 20px;margin-bottom: 50px;min-height: 250px">
      <div>
      <el-col :span="10">
        <el-upload
          ref="upload1"
          :action=uploadImageUrl
          :headers="headers"
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
      <div style="width: 300px">
        <el-input v-model="imageUUID" placeholder="" style="margin-bottom: 20px"></el-input>
        <img :v-if="loadImage" :src="getImageUrl">
      </div>
    </div>
  </section>
</template>


<script>
  import * as RestAPI from "../api/RestAPI.js"

  export default {
    name: "ImageView",
    data() {
      return {
        uploadImageUrl: RestAPI.zimgUrl + "/upload",
        fetchImageUrl: RestAPI.zimgUrl,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        imageCountLimit: 3,
        fileList: [],
        imageUUID: null
      }
    },
    methods: {
      handleSuccess(response, file, fileList) {
        console.log(response)
        var _this = this;
        _this.$message({
          type: 'success',
          message: '上传成功'
        });
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
        if(exceedSize)
        {
          this.$message.error("上传图片大小不能超过10MB");
          return false;
        }
        return true;
      },
      submitUpload() {
        this.$refs.upload1.submit();
      },
      loadImage() {
        // return this.imageUUID != null && this.imageUUID !== "";
        // return imageUUID.length === 16;
        return false;
      },
      getImageUrl() {
        return this.fetchImageUrl + "/" + this.imageUUID;
      }
    }
  }
</script>
