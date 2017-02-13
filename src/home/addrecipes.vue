<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="标题" prop="title">
          <i-input :value.sync="formValidate.title" placeholder="请输入标题"></i-input>
      </Form-item>
      <Form-item label="材料" prop="materials">
            <Row>
                <i-col span="3">
                    <p style="text-align:center;">材料名称</p>
                </i-col>
                <i-col span="1" style="text-align: center">-</i-col>
                <i-col span="3">
                    <p style="text-align:center;">用料/用量</p>
                </i-col>
                <i-col span="1" style="text-align: center"><i-button @click="addMaterials" size="large" type="success" shape="circle" icon="ios-plus-empty"></i-button></i-col>
            </Row>
            <template v-for="item in formValidate.materials">
            <Row>
                <i-col span="3">
                    <i-input type="text" :value.sync="item.name" placeholder="请输入材料名称"></i-input>
                </i-col>
                <i-col span="1" style="text-align: center">-</i-col>
                <i-col span="3">
                    <i-input type="text" :value.sync="item.dosage" placeholder="请输入用料/用量"></i-input>
                </i-col>
                <i-col span="1" style="text-align: center"><i-button @click="removeMaterials(item)" size="small" type="error" shape="circle" icon="ios-minus-empty"></i-button></i-col>
            </Row>
            </template>
        </Form-item>
      <Form-item label="图片" prop="imgs">
        <div class="demo-upload-list" v-for="item in formValidate.imgs">
            <img :src="item">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
            </div>
        </div>
        <div class="weui_uploader_input_wrp" style="
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
            <img :src="img" v-if="visible" style="width: 100%">
        </Modal>
      </Form-item>
      <Form-item label="做法" prop="method">
          <i-input type="textarea" :value.sync="formValidate.method" placeholder="请输入做法"></i-input>
      </Form-item>
      <Form-item>
            <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
            <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
            <i-button type="ghost" @click="this.$router.go('/recipes/list')" style="margin-left: 8px">返回</i-button>
      </Form-item>
    </i-form>
  </Row>
</template>
<script>
  import store from '../store/recipes.js';
  import userStore from '../store/user.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        img: '',
        showupload: true,
        qiniutoken: '',
        qiniuUrl: '',
        visible: false,
        formValidate: {
          title: '',
          method: '',
          imgs: [],
          materials: [
            {
              name: '',
              dosage: ''
            }
          ],
        },
        ruleValidate: {
          title: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    ready() {
      window.x = this;
      this.getToken();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "9-2";
      });
    },
    methods: {
      addMaterials () {
        this.formValidate.materials.push({
          name: '',
          dosage: ''
        })
      },
      removeMaterials (item) {
        let index = this.formValidate.materials.indexOf(item);
        this.formValidate.materials.splice(index,1);
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
            _this.formValidate.imgs.push(url);
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
      handleView (item) {
        this.img = item;
        this.visible = true;
      },
      handleRemove (item) {
        let index = this.formValidate.imgs.indexOf(item);
        this.formValidate.imgs.splice(index,1);
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
        let param = {
          id: this.formValidate.id,
          title: this.formValidate.title,
          method: this.formValidate.method,
          imgs: JSON.stringify(this.formValidate.imgs),
          materials: JSON.stringify(this.formValidate.materials)
        }
        store.addRecipes(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.success('提交成功!', 1 , function () {
              _this.$router.go('/recipes/list');
            });
          } else {
            this.$Message.error('提交失败!');
          }
        });
      }
    }
  }
</script>
