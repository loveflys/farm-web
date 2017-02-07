<style>
</style>
<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="手机号" prop="phone">
          <i-input :value.sync="formValidate.phone" placeholder="请输入手机号"></i-input>
      </Form-item>
      <Form-item label="密码" prop="pwd">
          <i-input type="password" :value.sync="formValidate.pwd" placeholder="请输入密码"></i-input>
      </Form-item>
      <Form-item label="昵称" prop="name">
          <i-input :value.sync="formValidate.name" placeholder="请输入昵称"></i-input>
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
            <Radio-group :model.sync="formValidate.sex">
                <Radio value="1">用户</Radio>
                <Radio value="2">商户</Radio>
            </Radio-group>
      </Form-item>
      <Form-item label="推送">
            <Radio-group :model.sync="formValidate.sex">
                <Radio value="0">不接受</Radio>
                <Radio value="1">接受</Radio>
                <Radio value="2">仅在wifi下接收</Radio>
            </Radio-group>
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
          phone: '',
          pwd: '',
          name: '',
          realName: '',
          address: '',
          deviceId: 'pc',
          avatar: '',
          sex: '1',  // 1男 2女
          type: '1', // 1用户 2商户
          pushsetting: '1', //0: 不接受 1：接收  2：仅在wifi下接收
          ciphertext: ''
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
