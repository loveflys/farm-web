<style scoped lang="less">
    .index{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
        h1{
            height: 150px;
            img{
                height: 100%;
            }
        }
        h2{
            color: #666;
        }
        .ivu-row{
            height: 100%;
        }
    }
</style>
<template>
<div class="login-box">
<div class="login-logo">
  <a href="javascript:void(0);"><b>Chenanyi</b>System</a>
</div>
<div class="login-box-body">
  <p class="login-box-msg">come on！傻狍子！</p>
    <i-form v-ref:form :model="form" :rules="ruleCustom">
      <Form-item prop="username">
          <i-input type="text" :value.sync="form.username"></i-input>
      </Form-item>
      <Form-item prop="passwd">
          <i-input type="password" :value.sync="form.passwd"></i-input>
      </Form-item>
      <Form-item>
          <i-button long type="primary" @click="handleSubmit('form')">提交</i-button>
          <i-button long type="ghost" @click="handleReset('form')">重置</i-button>
      </Form-item>

    </i-form>
</div>
</div>
  
</template>
<script>
  import store from '../store/login.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      const validateUserName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账户'));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        form: {
          username: '',
          passwd: ''
        },
        ruleCustom: {
          username: [
            { validator: validateUserName, trigger: 'blur' }
          ],
          passwd: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      }
    },
    ready() {
      window.x = this;
    },
    methods: {
      fileUpload: function (e) {
        if ($("#up_file")[0].files.length === 0) {
          return false;
        }
        var _this = this;
        this.$parent.$refs.toast.show('文件上传中...');
        var upForm = new FormData();
        upForm.append("myfile", $("#up_file")[0].files[0]);
        $.ajax({
          url: config.ENVELOPE_URL,
          type: 'POST',
          data: upForm,
          processData: false,
          contentType: false,
          success: function (rs) {
            if (rs.code === '0') {
              _this.fileUrl = rs.url;
              _this.deleteBtn = true;
              _this.photoIds.push(_this.fileUrl);
              if (_this.responseType === '2') {
                $("#imageUrl").css("display", '');
                $("#delete").css("display", '');
                $(".weui_uploader_input_wrp").css("display", 'none');
              } else {
              }
            } else {
              alert('文件上传失败');
              _this.fileUrl = '';
            }
            _this.$parent.$refs.toast.hide();
          },
          error: function () {
            _this.fileUrl = '';
            alert('文件上传失败');
          }
        });
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.login();
            //this.$Message.success('提交成功!==>'+JSON.stringify(this.form));
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      login () {
        let pwd = this.aes(this.form.passwd)+"";
        let temp = pwd+"*"+this.form.username;
        let ciphertext = this.aes(temp)+"";
        let param = {
          ciphertext: ciphertext
        }
        store.login(param, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            cookie.set("X-USERID",msg.userid);
            cookie.set("X-TOKEN",msg.token);
            this.$Message.success('登录成功!');
            window.location.href="/home/index.html#!/"
          } else {
            this.$Message.error('登录失败!');
          }
        });
      },
      aes (data) {
        let crypto = require('crypto');
        var cipher = crypto.createCipheriv(config.ALGORITHM, config.KEY,config.IV);
        var crypted = cipher.update(data, config.CLEARENCODING, 'binary');
        crypted += cipher.final('binary');
        crypted = new Buffer(crypted, 'binary').toString(config.CIPHERENCODING);
        console.log(crypted);
        return crypted;
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    }
  }
</script>
