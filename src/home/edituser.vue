<style>
</style>
<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="手机号" prop="phone">
          <i-input :value="formValidate.phone" placeholder="请输入手机号" disabled></i-input>
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
              display: block;" @change="uploadFile(1)" type="file" accept="image/jpg,image/jpeg,image/png" name="" id="files1" accept="*/*">
        </div>
        <Modal title="查看图片" :visible.sync="visible">
            <img :src="formValidate.avatar" v-if="visible" style="width: 100%">
        </Modal>
      </Form-item>
      <Form-item v-if="formValidate.type==2" label="摊位/店铺图片" prop="shopImg">
        <div class="demo-upload-list" v-if="!showuploadshopImg">
          <img :src="formValidate.shopImg">
          <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click="handleView(2)"></Icon>
              <Icon type="ios-trash-outline" @click="handleRemove(2)"></Icon>
          </div>
        </div>
        <div v-if="showuploadshopImg" class="weui_uploader_input_wrp" style="
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
              display: block;" @change="uploadFile(2)" type="file" accept="image/jpg,image/jpeg,image/png" name="" id="files2" accept="*/*">
        </div>
        <Modal title="查看图片" :visible.sync="shopImgvisible">
            <img :src="formValidate.shopImg" v-if="shopImgvisible" style="width: 100%">
        </Modal>
      </Form-item>
      <Form-item v-if="formValidate.type==2" label="手持身份证照片" prop="identityImg">
        <div class="demo-upload-list" v-if="!showuploadidentityImg">
          <img :src="formValidate.identityImg">
          <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click="handleView(3)"></Icon>
              <Icon type="ios-trash-outline" @click="handleRemove(3)"></Icon>
          </div>
        </div>
        <div v-if="showuploadidentityImg" class="weui_uploader_input_wrp" style="
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
              display: block;" @change="uploadFile(3)" type="file" accept="image/jpg,image/jpeg,image/png" name="" id="files3" accept="*/*">
        </div>
        <Modal title="查看图片" :visible.sync="identityImgvisible">
            <img :src="formValidate.identityImg" v-if="identityImgvisible" style="width: 100%">
        </Modal>
      </Form-item>
      <Form-item label="真实姓名" prop="realName">
          <i-input :value.sync="formValidate.realName" placeholder="请输入真实姓名"></i-input>
      </Form-item>
      <Form-item label="住址" prop="address">
          <i-input :value.sync="formValidate.address" placeholder="请输入住址"></i-input>
      </Form-item>
      <Form-item v-show="showMap" label="商铺地址" prop="shopLocation">
          <div id="allmap" style="height: 50vh;"></div>
      </Form-item>
      <Form-item v-if="formValidate.type==2" label="所属市场">
          <i-select :model.sync="formValidate.marketid" placeholder="请选择">
            <i-option v-for="item in MarketList" :value="item.id">{{item.name}}</i-option>
          </i-select>
      </Form-item>
      <Form-item label="性别">
            <Radio-group :model.sync="formValidate.sex">
                <Radio value="1">男</Radio>
                <Radio value="2">女</Radio>
            </Radio-group>
      </Form-item>
      <Form-item label="类型">
            <Radio-group :model.sync="formValidate.type">
                <Radio value="1">用户</Radio>
                <Radio value="2">商户</Radio>
            </Radio-group>
      </Form-item>
      <Form-item label="推送">
            <Radio-group :model.sync="formValidate.pushsetting">
                <Radio value="0">不接受</Radio>
                <Radio value="1">接受</Radio>
                <Radio value="2">仅在wifi下接收</Radio>
            </Radio-group>
      </Form-item>
      <Form-item>
            <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
            <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
            <i-button type="ghost" @click="this.$router.go('/user/list')" style="margin-left: 8px">返回</i-button>
      </Form-item>
    </i-form>
  </Row>
</template>
<script>
  import store from '../store/user.js';
  import marketStore from '../store/market.js';
  import config from '../utils/config.js';
  import aes from '../utils/aes.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        showMap: true,
        MarketList: [],
        showupload: true,
        showuploadshopImg: true,
        showuploadidentityImg: true,
        qiniutoken: '',
        qiniuUrl: '',
        visible: false,
        shopImgvisible: false,
        identityImgvisible: false,
        formValidate: {
          lon: null,
          lat: null,
          phone: '',
          name: '',
          realName: '',
          address: '',
          deviceId: 'pc',
          avatar: '',
          shopImg: '',
          identityImg: '',
          sex: '1',  // 1男 2女
          type: '1', // 1用户 2商户
          pushsetting: '1', //0: 不接受 1：接收  2：仅在wifi下接收
          ciphertext: ''
        },
        ruleValidate: {
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '住址不能为空', trigger: 'blur' }
          ],
          avatar: [
            { required: true, message: '头像不能为空', trigger: 'blur' }
          ],
          shopImg: [
            { required: true, message: '店铺图不能为空', trigger: 'blur' }
          ],
          identityImg: [
            { required: true, message: '手持身份证图不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      formValidate: {
        handler (curVal) {
          if (this.formValidate.type==2) {
            this.showMap = true;
          } else {
            this.showMap = false;
          }
        },
        deep: true
      }
    },
    ready() {
      window.x = this;
      this.getData();
      this.getToken();
      this.$nextTick(function () {
        //this.$parent.$root.$data.activekey = "3-2";
      });
    },
    methods: {
      getData () {
        let _this = this;
        let param = {
          id: this.$route.params.id
        }
        store.getUser(param, (msg)=> {
          if (msg.code === '0') {
            if (msg.user.avatar&&msg.user.avatar.length > 0) {
              this.showupload = false;
            }
            window.map = new BMap.Map("allmap");
            if (msg.user.type === 2) {
              if (msg.user.identityImg && msg.user.identityImg.length > 0) {
                this.showuploadidentityImg = false;
              }
              if (msg.user.shopImg && msg.user.shopImg.length > 0) {
                this.showuploadshopImg = false;
              }
            }
            this.formValidate = {
              shopLocation: msg.user.shopLocation,
              lon: msg.user.shopLocation?msg.user.shopLocation.longitude:"",
              lat: msg.user.shopLocation?msg.user.shopLocation.latitude:"",
              id: msg.user.id,
              phone: msg.user.phone,
              pwd: '',
              name: msg.user.name,
              shopImg: msg.user.shopImg,
              identityImg: msg.user.identityImg,
              marketid: msg.user.marketid,
              realName: msg.user.realName,
              address: msg.user.address,
              deviceId: msg.user.deviceId,
              avatar: msg.user.avatar,
              sex: msg.user.sex + '',  // 1男 2女
              type: msg.user.type, // 1用户 2商户
              pushsetting: msg.user.pushsetting, //0: 不接受 1：接收  2：仅在wifi下接收
              ciphertext: ''
            };
            this.getMap();

          } else {
            this.$Message.error('获取用户信息失败!', 1 , function () {
              _this.$router.go('/user/list');
            });
          }
        });
      },
      getMap () {
        window.map = new BMap.Map("allmap");
        if (this.formValidate.shopLocation) {
          let point = new BMap.Point(this.formValidate.lon,this.formValidate.lat);
          map.centerAndZoom(point,18);
          map.enableScrollWheelZoom();
          var myCity = new BMap.LocalCity();
          map.addEventListener("click", this.showInfo);
          map.addEventListener("tilesloaded",this.setCenter);
        } else {
          console.log('nolocation');
          let point = new BMap.Point(116.331398,39.897445);
          map.centerAndZoom(point,18);
          map.enableScrollWheelZoom();
          var myCity = new BMap.LocalCity();
          myCity.get(this.myFun);
          map.addEventListener("click", this.showInfo);
          map.addEventListener("tilesloaded",this.setCenter);
        }
        map.disableDoubleClickZoom()
      },
      setCenter() {
        map.removeEventListener("tilesloaded",this.setCenter);
        let temp = map.getCenter();
        let point = new BMap.Point(temp.lng,temp.lat);
        this.formValidate.lon = temp.lng;
        this.formValidate.lat = temp.lat;
        let marker = new BMap.Marker(point);
        let allOverlay = map.getOverlays();
        for (let item of allOverlay){
          map.removeOverlay(item);
        }
        map.addOverlay(marker);
        this.getMarket();
      },
      myFun (result) {
        var cityName = result.name;
        map.setCenter(cityName);
        console.log("当前定位城市:"+cityName);
      },
      showInfo (e) {
        let allOverlay = map.getOverlays();
        let point = new BMap.Point(e.point.lng, e.point.lat);
        this.formValidate.lon = e.point.lng;
        this.formValidate.lat = e.point.lat;
        let marker = new BMap.Marker(point);
        for (let item of allOverlay){
          map.removeOverlay(item);
        }
        map.addOverlay(marker);
        this.getMarket();
      },
      getMarket () {
        let _this = this;
        map
        let param = {
          lon: this.formValidate.lon,
          lat: this.formValidate.lat,
          pagenum: 1,
          pagesize: 5,
          paged: 1,
          max: 100
        };
        marketStore.getMarketList(param, function (data) {
          if (data.code === "0") {
            _this.MarketList = data.list;
          } else {
            _this.$Notice.warning({
                title: '提示',
                desc: data.msg
            });
          }
        });
      },
      uploadFile (type) {
        let fileInputId = '';
        switch(type) {
          case 1:
            fileInputId = "files1";
            break;
          case 2:
            fileInputId = "files2";
            break;
          case 3:
            fileInputId = "files3";
            break;
        }
        let _this = this;
        let files = document.getElementById(fileInputId).files[0];
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

            switch(type) {
              case 1:
                _this.formValidate.avatar = url;
                _this.showupload = false;
                break;
              case 2:
                _this.formValidate.shopImg = url;
                _this.showuploadshopImg = false;
                break;
              case 3:
                _this.formValidate.identityImg = url;
                _this.showuploadidentityImg = false;
                break;
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
        store.getToken(param, function (data) {
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
        switch(type) {
          case 1:
            this.visible = true;
            break;
          case 2:
            this.shopImgvisible = true;
            break;
          case 3:
            this.identityImgvisible = true;
            break;
        }
      },
      handleRemove (type) {
        switch(type) {
          case 1:
            this.formValidate.avatar = "";
            this.showupload = true;
            break;
          case 2:
            this.formValidate.shopImg = "";
            this.showuploadshopImg = true;
            break;
          case 3:
            this.formValidate.identityImg = "";
            this.showuploadidentityImg = true;
            break;
        }
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
        let temp = "*"+this.formValidate.phone;
        let ciphertext = aes.encode(temp)+"";
        this.formValidate.ciphertext = ciphertext;
        store.updateUser(this.formValidate, (msg)=> {
          if (msg.code === '0') {
            this.$Message.success('修改成功!', 1 , function () {
              _this.$router.go('/user/list');
            });
          } else {
            this.$Message.error('修改失败!');
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
