<style>
</style>
<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="标题" prop="title">
          <i-input :value.sync="formValidate.title" placeholder="请输入标题"></i-input>
      </Form-item>
      <Form-item label="权重" prop="weight">
          <i-input type="text" :value.sync="formValidate.weight" placeholder="请输入权重"></i-input>
      </Form-item>
      <Form-item label="主图" prop="mainImg">
        <div class="demo-upload-list" v-if="!showupload">
          <img :src="formValidate.mainImg">
          <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click="handleView(1)"></Icon>
              <Icon type="ios-trash-outline" @click="handleRemove(1)"></Icon>
          </div>
        </div>
        <div v-if="showupload" class="weui_uploader_input_wrp" style="
          display: inline-block;
          width: 60px;
          height: 60px;
          text-align: center;
          line-height: 60px;
          border: 1px solid transparent;
          border-radius: 4px;
          overflow: hidden;
          background: #fff;
          position: relative;
          box-shadow: 0 1px 1px rgba(0,0,0,.2);">
            <input style="opacity: 0;
              width: 100%;
              height: 100%;
              position: relative;
              display: block;" @change="uploadFile()" type="file" accept="image/jpg,image/jpeg,image/png" name="" id="files" accept="*/*">
        </div>
        <Modal title="查看图片" :visible.sync="visible">
            <img :src="formValidate.mainImg" v-if="visible" style="width: 100%">
        </Modal>
      </Form-item>
      <Form-item label="类型">
            <Radio-group :model.sync="formValidate.type">
                <Radio value="1">普通消息</Radio>
                <Radio value="2">美食消息</Radio>
            </Radio-group>
      </Form-item>
      <Form-item label="内容" prop="descr">
          <i-input type="textarea" :value.sync="formValidate.content" placeholder="请填写内容"></i-input>
      </Form-item>
      <Form-item>
            <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
            <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
            <i-button type="ghost" @click="this.$router.go('/info/list')" style="margin-left: 8px">返回</i-button>
      </Form-item>
    </i-form>
  </Row>
</template>
<script>
  import store from '../store/info.js';
  import userStore from '../store/user.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        showupload: true,
        qiniutoken: '',
        qiniuUrl: '',
        visible: false,
        formValidate: {
          authorName: "官方",
          title: '',
          content: '',
          type: '1', //1-普通消息  2-美食消息
          mainImg: '',
          weight: '0'
        },
        ruleValidate: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          mainImg: [
            { required: true, message: '主图不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    ready() {
      window.x = this;
      this.getToken();
      //this.$nextTick(function () {
      //  this.$parent.$root.$data.activekey = "3-2";
      //});
    },
    methods: {
      uploadFile (type) {
        let _this = this;
        let files = document.getElementById("files").files[0];
        if (files === null || files === undefined) {
          _this.$Notice.warning({
              title: '提示',
              desc: '请先选择文件。'
          });
          return;
        }
        if (files.size/(1024*1024) > 2) {
          _this.$Notice.warning({
              title: '超出文件大小限制',
              desc: '文件' + files.name + ' 太大，不能超过 2M。'
          });
          return;
        }

        let oData = new FormData();
        oData.append("file", files);
        oData.append("token", this.qiniutoken);
        var oReq = new XMLHttpRequest();
        oReq.open( "POST", config.QINIU_URL , true );
        oReq.onload = function(oEvent) {
          let res = JSON.parse(oReq.response);
          if (oReq.status === 200 && res.key) {
            let url = _this.qiniuUrl + res.key;
            _this.formValidate.mainImg = url;
            _this.showupload = false;
          } else {
            _this.$Notice.warning({
                title: '提示',
                desc: '上传失败。'
            });
          }
        };
        oReq.onerror = function(err) {
          _this.$Notice.warning({
              title: '提示',
              desc: '上传错误。'
          });
        };
        oReq.send(oData);
      },
      getToken () {
        let _this = this;
        let param = {};
        userStore.getToken(param, function (data) {
          console.log(JSON.stringify(data));
          if (data.code === "0") {
            _this.qiniutoken = data.token;
            _this.qiniuUrl = data.url;
          } else {
            _this.$Notice.warning({
                title: '提示',
                desc: data.msg
            });
          }
        });
      },
      handleView (type) {
        this.visible = true;
      },
      handleRemove (type) {
        this.formValidate.mainImg = "";
        this.showupload = true;
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addData();
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      addData () {
        let _this = this;
        store.addInfo(this.formValidate, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.$Message.success('提交成功!', 1 , function () {
              _this.$router.go('/info/list');
            });
          } else {
            this.$Message.error('提交失败!');
          }
        });
      }
    }
  }
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
