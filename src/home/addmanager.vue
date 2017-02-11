<style>
</style>
<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="登录账户" prop="login">
          <i-input :value.sync="formValidate.login" placeholder="请输入登录账户"></i-input>
      </Form-item>
      <Form-item label="手机号" prop="phone">
          <i-input :value.sync="formValidate.phone" placeholder="请输入手机号"></i-input>
      </Form-item>
      <Form-item label="密码" prop="pwd">
          <i-input type="password" :value.sync="formValidate.pwd" placeholder="请输入密码"></i-input>
      </Form-item>
      <Form-item label="昵称" prop="name">
          <i-input :value.sync="formValidate.name" placeholder="请输入昵称"></i-input>
      </Form-item>
      <Form-item label="头像" prop="avatar">
        <div class="demo-upload-list" v-if="!showupload">
          <img :src="formValidate.avatar">
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
              display: block;" @change="uploadFile(1)" type="file" accept="image/jpg,image/jpeg,image/png" name="" id="files" accept="*/*">
        </div>
        <Modal title="查看图片" :visible.sync="visible">
            <img :src="formValidate.avatar" v-if="visible" style="width: 100%">
        </Modal>
      </Form-item>
      <Form-item label="真实姓名" prop="realName">
          <i-input :value.sync="formValidate.realName" placeholder="请输入真实姓名"></i-input>
      </Form-item>
      <Form-item label="性别">
            <Radio-group :model.sync="formValidate.sex">
                <Radio value="1">男</Radio>
                <Radio value="2">女</Radio>
            </Radio-group>
      </Form-item>
      <Form-item label="类型">
            <Radio-group :model.sync="formValidate.type">
                <Radio value="3">普通管理员</Radio>
                <Radio value="4">超级管理员</Radio>
            </Radio-group>
      </Form-item>
      <Form-item>
            <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
            <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
            <i-button type="ghost" @click="this.$router.go('/manager/list')" style="margin-left: 8px">返回</i-button>
      </Form-item>
    </i-form>
  </Row>
</template>
<script>
  import store from '../store/manager.js';
  import userStore from '../store/user.js';
  import config from '../utils/config.js';
  import aes from '../utils/aes.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        showupload: true,
        qiniutoken: '',
        qiniuUrl: '',
        visible: false,
        formValidate: {
          login: '',
          phone: '',
          pwd: '',
          name: '',
          realName: '',
          deviceId: 'pc',
          avatar: '',
          sex: '1',  // 1男 2女
          type: '3', // 3-普通管理员 4-超级管理员
          ciphertext: ''
        },
        ruleValidate: {
          login: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          pwd: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' }
          ],
          avatar: [
            { required: true, message: '头像不能为空', trigger: 'blur' }
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
            _this.formValidate.avatar = url;
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
        this.formValidate.avatar = "";
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
        let pwd = aes.encode(this.formValidate.pwd)+"";
        let temp = pwd+"*"+this.formValidate.phone+"*"+this.formValidate.login;
        let ciphertext = aes.encode(temp)+"";
        this.formValidate.ciphertext = ciphertext;
        store.addManager(this.formValidate, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.$Message.success('提交成功!', 1 , function () {
              _this.$router.go('/manager/list');
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
