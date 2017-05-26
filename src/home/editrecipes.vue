<template>
<Row style="margin: 20px">
  <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Form-item label="标题" prop="title">
        <i-input :value.sync="formValidate.title" placeholder="请输入标题"></i-input>
    </Form-item>
    <Form-item label="描述" prop="descr">
        <i-input type="textarea" :autosize="{minRows: 2,maxRows: 5}" :value.sync="formValidate.descr" placeholder="请输入描述"></i-input>
    </Form-item>
    <Form-item label="主图" prop="step_img" style="margin: 20px 0;">
      <div class="demo-upload-list" v-if="formValidate.mainImg!=''">
          <img :src="formValidate.mainImg">
          <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click="handleView(formValidate.mainImg)"></Icon>
              <Icon type="ios-trash-outline" @click="formValidate.mainImg=''"></Icon>
          </div>
      </div>
      <div v-if="formValidate.mainImg==''" class="weui_uploader_input_wrp" style="
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
            display: block;" @change="uploadFile(2)" type="file" accept="image/jpg,image/jpeg,image/png" name="" id="imgfiles" accept="*/*">
      </div>
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
                    <Cascader placeholder="请输入材料名称" :data="classes" :value.sync="item.name" :render-format="format"></Cascader>
                </i-col>
                <i-col span="1" style="text-align: center">-</i-col>
                <i-col span="3">
                    <i-input type="text" :value.sync="item.dosage" placeholder="请输入用料/用量"></i-input>
                </i-col>
                <i-col span="1" style="text-align: center"><i-button @click="removeMaterials(item)" size="small" type="error" shape="circle" icon="ios-minus-empty"></i-button></i-col>
            </Row>
          </template>
    </Form-item>

    <Form-item label="步骤" prop="steps">
          <Row>
              <i-col span="3">
                  <p style="text-align:center;">添加步骤</p>
              </i-col>
              <i-col span="1" style="text-align: center"><i-button @click="addStep" size="large" type="success" shape="circle" icon="ios-plus-empty"></i-button></i-col>
          </Row>
          <template v-for="(index,item) in formValidate.steps">
            <Row style="border:1px solid #e0e0e0;padding:20px;margin-bottom:10px;">
                <i-col>
                    <i-input type="text" :value.sync="item.step_title" placeholder="请输入步骤标题"></i-input>
                </i-col>
                <Form-item prop="step_img" style="margin: 20px 0;">
                  <div class="demo-upload-list" v-if="item.step_img!=''">
                      <img :src="item.step_img">
                      <div class="demo-upload-list-cover">
                          <Icon type="ios-eye-outline" @click="handleView(item.step_img)"></Icon>
                          <Icon type="ios-trash-outline" @click="item.step_img=''"></Icon>
                      </div>
                  </div>
                  <div v-if="item.step_img==''" class="weui_uploader_input_wrp" style="
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
                        display: block;" @change="uploadFile(1, index)" type="file" accept="image/jpg,image/jpeg,image/png" name="" :id="'files'+index" accept="*/*">
                  </div>
                </Form-item>
                <i-col>
                    <i-input type="text" :value.sync="item.step_descr" placeholder="请输入详细步骤"></i-input>
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
  import classStore from '../store/class.js';
  import userStore from '../store/user.js';
  import config from '../utils/config.js';
  export default {
    data () {
      return {
        img: '',
        allClass: [],
        classes: [],
        showupload: true,
        qiniutoken: '',
        qiniuUrl: '',
        visible: false,
        formValidate: {
          id: '',
          title: '',
          descr: '',
          mainImg: '',
          imgs: [],
          materials: [
            {
              name: [],
              dosage: ''
            }
          ],
          steps: [
            {
              step_title: '',
              step_img: '',
              step_descr: ''
            }
          ]
        },
        ruleValidate: {
          title: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    ready () {
      window.x = this;
      this.getToken();
      this.getClass();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "9-2";
      });
    },
    methods: {
      format (labels, selectedData) {
        return labels[labels.length - 1];
      },
      getClass () {
        classStore.getClassList({}, (msg)=> {
          if (msg.code === '0') {
            let classes = [];
            this.allClass = msg.list;
            for (let item of msg.list) {
              if (item.parentId == "" && item.level === 1) {
                classes.push({
                  value: item.id,
                  label: item.name,
                  children: []
                });
              }
            }

            for (let item of classes) {
              for (let i of msg.list) {
                if (i.parentId == item.value && i.level === 2) {
                  item.children.push({
                    value: i.id,
                    label: i.name,
                    children: []
                  })
                }
              }
            }

            for (let item of classes) {
              for (let it of item.children) {
                for (let i of msg.list) {
                  if (i.parentId == it.value && i.level === 3) {
                    it.children.push({
                      value: i.id,
                      label: i.name,
                    })
                  }
                }
              }
            }

            this.classes = classes;
          } else {
            this.$Message.error('获取分类列表失败!');
          }
        });
      },
      getData () {
        let _this = this;
        let param = {
          id: this.$route.params.id
        }
        let materials = [];

        store.getRecipes(param, (msg)=> {
          if (msg.code === '0') {
            let materials = [];
            for (let item of msg.recipes.materials) {
              let name = [];
              for (let i of this.allClass) {
                if (i.id == item.id) {
                  name.unshift(i.id);
                  for (let temp of this.allClass) {
                    if (temp.id == i.parentId) {
                      name.unshift(temp.id);
                      name.unshift(temp.parentId);
                    }
                  }
                }
              }
              materials.push({
                name: name,
                dosage: item.dosage
              });
            }
            this.formValidate = {
              id: msg.recipes.id,
              title: msg.recipes.title,
              descr: msg.recipes.descr,
              mainImg: msg.recipes.mainImg,
              steps: msg.recipes.steps,
              imgs: msg.recipes.imgs,
              materials: materials
            };
          } else {
            this.$Message.error('获取食谱信息失败!', 1, function () {
              _this.$router.go('/recipes/list');
            });
          }
        });
      },
      addMaterials () {
        this.formValidate.materials.push({
          name: [],
          dosage: ''
        })
      },
      addStep () {
        this.formValidate.steps.push({
          step_title: '',
          step_img: '',
          step_descr: ''
        });
      },
      removeMaterials (item) {
        let index = this.formValidate.materials.indexOf(item);
        this.formValidate.materials.splice(index, 1);
      },
      removeMaterials (item) {
        let index = this.formValidate.steps.indexOf(item);
        this.formValidate.steps.splice(index, 1);
      },
      uploadFile (type, index) {
        let _this = this;
        let files = null;
        if (type != '1') {
          if (type == '2') {
            files = document.getElementById('imgfiles').files[0];
          } else {
            files = document.getElementById("files").files[0];
          }
        } else {
          let name = 'files'+index;
          files = document.getElementById(name).files[0];
        }
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
            if (type != '1') {
              if (type == '2') {
                _this.formValidate.mainImg = url;
              } else {
                _this.formValidate.imgs.push(url);
              }
            } else {
              _this.formValidate.steps[index].step_img = url;
            }
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
            _this.getData();
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
            this.editData();
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      editData () {
        let _this = this;
        let materials = [];
        for (let item of this.formValidate.materials) {
          let temp = item.name.pop();
          for(let i of this.allClass) {
            if (temp == i.code) {
              materials.push({
                id: i.code,
                name: i.name,
                dosage: item.dosage
              });
            }
          }
        }
        let param = {
          id: this.formValidate.id,
          title: this.formValidate.title,
          descr: this.formValidate.descr,
          mainImg: this.formValidate.mainImg,
          method: this.formValidate.method,
          imgs: JSON.stringify(this.formValidate.imgs),
          materials: JSON.stringify(materials),
          method: JSON.stringify(this.formValidate.steps)
        }
        store.updateRecipes(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.success('修改成功!', 1 , function () {
              _this.$router.go('/recipes/list');
            });
          } else {
            this.$Message.error('修改失败!');
          }
        });
      }
    }
  }
</script>
