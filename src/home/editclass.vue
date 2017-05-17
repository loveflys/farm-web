<style>
</style>
<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="名称" prop="name">
          <i-input :value.sync="formValidate.name" placeholder="请输入名称"></i-input>
      </Form-item>
      <Form-item label="分类描述" prop="descr" v-show="formValidate.level == 3">
          <div id="editor-container" class="container">
              <textarea id="editor-trigger" :value.sync="formValidate.descr" style="display:none;">
              </textarea>
          </div>
      </Form-item>
      <Form-item label="所属分类" prop="parentId">
        <Cascader placeholder="请输入所属分类" :data="classes" change-on-select :value.sync="select" :render-format="format"></Cascader>
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
        select: [],
        classes: [],
        allClasses: [],
        showupload: true,
        qiniutoken: '',
        qiniuUrl: '',
        visible: false,
        formValidate: {
          nutrition: '',
          descr: '',
          name: '',
          level: '1',
          mainImg: '',
          parentId: ''
        },
        ruleValidate: {
          nutrition: [
            { required: true, message: '营养信息不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
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
    watch: {
      select: {
        handler (curVal) {
          let temp = curVal[curVal.length - 1];
          if (!temp || temp.length <= 0) {
            this.formValidate.level = 1;
            this.parentId = '';
          } else {
            for (let item of this.allClasses) {
              if (item.id == temp) {
                this.formValidate.level = item.level + 1;
                this.formValidate.parentId = item.id;
              }
            }
          }
        },
        deep: true
      }
    },
    ready () {
      window.x = this;
      this.getData();
      this.getAllClasses();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "2-4";
      });
    },
    methods: {
      getData () {
        let _this = this;
        let param = {
          id: this.$route.params.id
        };
        store.getClass(param, (msg) => {
          this.getToken();
          if (msg.code === '0') {
            this.formValidate = msg.result;
            this.select.push(msg.result.parentId);
            this.formValidate.level = msg.result.level + '';
            if (msg.result.mainImg && msg.result.mainImg.length > 0) {
              this.showupload = false;
            }
          } else {
            this.$Message.error('获取分类信息失败!', 1, function () {
              _this.$router.go('/class/list');
            });
          }
        });
      },
      getAllClasses () {
        store.getClassList({}, (msg) => {
          if (msg.code === "0") {
            let classes = [{
              value: "",
              label: "无",
              level: 1,
              children: []
            }];
            this.allClasses = msg.list;
            for (let item of msg.list) {
              if (item.level == 1) {
                classes.push({
                  value: item.id,
                  label: item.name,
                  level: 2,
                  children: []
                });
              }
            }
            for (let item of classes) {
              for (let i of msg.list) {
                if (i.parentId == item.value && i.level == 2) {
                  item.children.push({
                    value: i.id,
                    label: i.name,
                    level: 3,
                    children: []
                  });
                }
              }
            }
            this.classes = classes;
          } else {
            this.$Notice.warning({
              title: '提示',
              desc: msg.msg
            });
          }
        });
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addData();
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      getEditor () {
        var _this = this;
        let token = this.qiniutoken;
        var editor = new wangEditor('editor-trigger');
        editor.config.uploadImgFileName = 'file';
        editor.config.uploadImgUrl = config.FILE_UPLOAD;
        editor.config.uploadHeaders = {
          'X-TOKEN' : window.localStorage.getItem("X-TOKEN"),
          'X-USERID' : window.localStorage.getItem("X-USERID")
        };
        editor.config.uploadImgFns.onload = function (res, xhr) {
          let data = JSON.parse(res);
          if (data.code === '0') {
            editor.command(null, 'InsertImage', data.url);
          } else {
            alert(data.msg);
          }
        };
        editor.onchange = function () {
          _this.formValidate.descr = this.$txt.html();
        };
        editor.create();
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
            _this.getEditor();
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
            this.editData();
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      editData () {
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
        store.updateClass(this.formValidate, (msg) => {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.$Message.success('修改成功!', 1, function () {
              _this.$router.go('/class/list');
            });
          } else {
            this.$Message.error('修改失败!');
          }
        });
      }
    }
  };
</script>
