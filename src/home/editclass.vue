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
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        formValidate: {
          nutrition: '',
          descr: '',
          name: '',
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
      }
    },
    ready() {
      window.x = this;
      this.getData();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "2-4";
      });
    },
    methods: {
      getData () {
        let _this = this;
        let param = {
          id: this.$route.params.id
        }
        store.getClass(param, (msg)=> {
          if (msg.code === '0') {
            this.formValidate = msg.result;
          } else {
            this.$Message.error('获取分类信息失败!', 1 , function () {
              _this.$router.go('/class/list');
            });
          }
        });
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
        if (this.formValidate.level == 1) {
          this.formValidate.parentId = '0';
        }
        store.updateClass(this.formValidate, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.$Message.success('修改成功!', 1 , function () {
              _this.$router.go('/class/list');
            });
          } else {
            this.$Message.error('修改失败!');
          }
        });
      }
    }
  }
</script>
