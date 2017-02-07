<style>
</style>
<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="全称" prop="fullName">
          <i-input :value.sync="formValidate.fullName" placeholder="请输入全称"></i-input>
      </Form-item>
      <Form-item label="名称" prop="name">
          <i-input :value.sync="formValidate.name" placeholder="请输入名称"></i-input>
      </Form-item>
      <Form-item label="编号" prop="code">
          <i-input :value.sync="formValidate.code" placeholder="请输入编号"></i-input>
      </Form-item>
      <Form-item label="级别" prop="level">
          <i-select :model.sync="formValidate.level" placeholder="请选择区划等级">
              <i-option value="1">省</i-option>
              <i-option value="2">市</i-option>
              <i-option value="3">区/县</i-option>
          </i-select>
      </Form-item>
      <Form-item label="父级" prop="parentId">
          <i-input :value.sync="formValidate.parentId" placeholder="请输入父级区划编号"></i-input>
      </Form-item>
      <Form-item>
            <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
            <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
            <i-button type="ghost" @click="this.$router.go('/address/list')" style="margin-left: 8px">返回</i-button>
      </Form-item>
    </i-form>
  </Row>
</template>
<script>
  import store from '../store/address.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        formValidate: {
          fullName: '',
          name: '',
          code: '',
          level: '1',
          parentId: ''
        },
        ruleValidate: {
          fullName: [
            { required: true, message: '全称不能为空', trigger: 'blur' }
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
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "3-2";
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
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      addData () {
        let _this = this;
        store.addAddr(this.formValidate, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.$Message.success('提交成功!', 1 , function () {
              _this.$router.go('/address/list');
            });
          } else {
            this.$Message.error('提交失败!');
          }
        });
      }
    }
  }
</script>
