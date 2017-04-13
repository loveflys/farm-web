<style>
</style>
<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="名称" prop="name">
          <i-input :value.sync="formValidate.name" placeholder="请输入名称"></i-input>
      </Form-item>
      <Form-item label="分类描述" prop="descr">
          <i-input type="textarea" :value.sync="formValidate.descr" placeholder="请填写分类描述"></i-input>
      </Form-item>
      <Form-item label="编号" prop="code">
          <i-input :value.sync="formValidate.code" placeholder="请输入编号"></i-input>
      </Form-item>
      <Form-item v-if="formValidate.level != 1" label="所属分类" prop="parentId">
          <i-input :value.sync="formValidate.parentId" placeholder="请输入所属分类(一级分类所属分类填0)"></i-input>
      </Form-item>
      <Form-item label="级别" prop="level">
          <i-select :model.sync="formValidate.level" placeholder="请选择区划等级">
              <i-option value="1">一级分类</i-option>
              <i-option value="2">二级分类</i-option>
              <i-option value="3">三级分类</i-option>
          </i-select>
      </Form-item>
      <Form-item label="主图" prop="mainImg" v-if="formValidate.level==3">
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
      <Form-item label="营养信息" prop="nutrition">
          <i-input type="textarea" :value.sync="formValidate.nutrition" placeholder="请填写营养信息"></i-input>
      </Form-item>


      <Form-item>
            <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
            <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
            <i-button type="ghost" @click="this.$router.go('/class/list')" style="margin-left: 8px">返回</i-button>
      </Form-item>
    </i-form>
  </Row>
</template>
<script>
  import store from '../store/class.js';
  import userStore from '../store/user.js';
  import config from '../utils/config.js';
  export default {
    data () {
      return {
        showupload: true,
        qiniutoken: '',
        qiniuUrl: '',
        visible: false,
        formValidate: {
          nutrition: '',
          descr: '',
          name: '',
          mainImg: '',
          code: '',
          level: '1',
          parentId: ''
        },
        ruleValidate: {
          nutrition: [
            { required: true, message: '营养信息不能为空', trigger: 'blur' }
          ],
          descr: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '编号不能为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '级别不能为空', trigger: 'change' }
          ],
          parentId: [
            { required: true, message: '父级不能为空', trigger: 'change' }
          ]
        }
      };
    },
    ready () {
      window.x = this;
      this.getToken();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "2-3";
      });
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addData();
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
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
        if (files.size / (1024 * 1024) > 2) {
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
        oReq.open("POST", config.QINIU_URL, true);
        oReq.onload = function (oEvent) {
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
        oReq.onerror = function (err) {
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
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      addData () {
        let _this = this;
        if (this.formValidate.level == 1) {
          this.formValidate.parentId = '0';
        }
        if (this.formValidate.level == 3) {
          if (!this.formValidate.mainImg || this.formValidate.mainImg.length <= 0) {
            this.$Notice.warning({
              title: '提示',
              desc: "请先上传分类主图"
            });
            return;
          }
        }
        store.addClass(this.formValidate, (msg) => {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.$Message.success('提交成功!', 1, function () {
              _this.$router.go('/class/list');
            });
          } else {
            this.$Message.error('提交失败!');
          }
        });
      }
    }
  };
</script>
