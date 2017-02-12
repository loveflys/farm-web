<style>
</style>
<template>
  <Row style="margin: 20px">
    <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="名称" prop="name">
          <i-input :value.sync="formValidate.name" placeholder="请输入名称"></i-input>
      </Form-item>
      <Form-item label="图片" prop="imgs">
        <div class="demo-upload-list" v-for="item in imgs">
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
      <Form-item label="描述" prop="descr">
          <i-input type="textarea" :value.sync="formValidate.descr" placeholder="请输入描述"></i-input>
      </Form-item>
      <Form-item label="所在地区划" prop="locationName">
        <i-select :model.sync="selectpro" placeholder="请选择省份">
            <i-option v-for="item in province" :value="item.divisionCode">{{item.name}}</i-option>
        </i-select>
        <i-select :model.sync="selectcity" placeholder="请选择市">
            <i-option v-for="item in city" :value="item.divisionCode">{{item.name}}</i-option>
        </i-select>
        <i-select :model.sync="selectdist" placeholder="请选择区/县">
            <i-option v-for="item in district" :value="item.divisionCode">{{item.name}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="所在地" prop="division">
          <i-input :value.sync="formValidate.locationName" placeholder="请输入所在地"></i-input>
      </Form-item>
      <Form-item label="商铺地址" prop="location">
          <div id="allmap" style="height: 50vh;"></div>
      </Form-item>
      <Form-item>
            <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
            <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
            <i-button type="ghost" @click="this.$router.go('/market/list')" style="margin-left: 8px">返回</i-button>
      </Form-item>
    </i-form>
  </Row>
</template>
<script>
  import store from '../store/market.js';
  import userStore from '../store/user.js';
  import addressStore from '../store/address.js';
  import config from '../utils/config.js';
  import aes from '../utils/aes.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        imgs: [],
        img: '',
        division: 0,
        province: [],
        selectpro: null,
        city: [],
        selectcity: null,
        district: [],
        selectdist: null,
        showupload: true,
        qiniutoken: '',
        qiniuUrl: '',
        visible: false,
        formValidate: {
          location: null,
          lon: null,
          lat: null,
          descr: '',
          name: '',
          locationName: '',
          imgs: [],
          division: '',
          id: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      selectpro () {
        this.division = this.selectpro;
        this.getDivision(2, this.division);
        this.city = [];
        this.district = [];
      },
      selectcity () {
        this.division = this.selectcity;
        this.getDivision(3, this.division);
        this.district = [];
      },
      selectdist () {
        this.division = this.selectdist;
      }
    },
    ready() {
      window.x = this;
      this.getToken();
      this.getData();
      this.getDivision(1, this.division);
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "7-2";
      });
    },
    methods: {
      getData () {
        let _this = this;
        let param = {
          id: this.$route.params.id
        }
        store.getMarket(param, (msg)=> {
          if (msg.code === '0') {
            this.formValidate = {
              location: msg.market.location,
              lon: msg.market.location.longitude,
              lat: msg.market.location.latitude,
              locationName: msg.market.locationName,
              descr: msg.market.descr,
              name: msg.market.name,
              imgs: msg.market.imgs,
              division: msg.market.division,
              id: msg.market.id
            }
            this.getMap();
            this.getDivisionDetail(msg.market.division);
            this.imgs = msg.market.imgs;
          } else {
            this.$Message.error('获取分类信息失败!', 1 , function () {
              _this.$router.go('/info/list');
            });
          }
        });
      },
      getDivisionDetail (id) {
        let _this = this;
        let param = {
          id: id
        };
        addressStore.getAddrByCode(param, function (data) {
          if (data.code === "0") {
            switch (data.division.level) {
              case 1:
                _this.selectpro = data.division.divisionCode;
                _this.getDivision(1, 0);
                break;
              case 2:
                _this.selectcity = data.division.divisionCode;
                _this.getDivision(2, _this.selectpro);
                break;
              case 3:
                _this.selectdist = data.division.divisionCode;
                _this.getDivision(3, _this.selectcity);
                break;
              default:
                _this.selectpro = data.division.divisionCode;
                break;
            }
          } else {
            _this.$Notice.warning({
                title: '提示',
                desc: data.msg
            });
          }
        });
      },
      getDivision (level) {
        let _this = this;
        let param = {
          level: level,
          parentId: this.division
        };
        addressStore.getAddrList(param, function (data) {
          if (data.code === "0") {
            switch (level) {
              case 1:
                _this.province = data.list;
                break;
              case 2:
                _this.city = data.list;
                break;
              case 3:
                _this.district = data.list;
                break;
              default:
                _this.province = data.list;
                break;
            }
          } else {
            _this.$Notice.warning({
                title: '提示',
                desc: data.msg
            });
          }
        });
      },
      getMap () {
        window.map = new BMap.Map("allmap");
        if (this.formValidate.location) {
          let point = new BMap.Point(this.formValidate.lon,this.formValidate.lat);
          map.centerAndZoom(point,12);
          map.enableScrollWheelZoom();
          var myCity = new BMap.LocalCity();
          this.setCenter();
          map.addEventListener("click", this.showInfo);
          map.addEventListener("tilesloaded",this.setCenter);
        } else {
          console.log('nolocation');
          let point = new BMap.Point(116.331398,39.897445);
          map.centerAndZoom(point,12);
          map.enableScrollWheelZoom();
          var myCity = new BMap.LocalCity();
          myCity.get(this.myFun);
          this.setCenter();
          map.addEventListener("click", this.showInfo);
          map.addEventListener("tilesloaded",this.setCenter);
        }
      },
      setCenter() {
        let temp = map.getCenter();
        console.log("temp==>"+temp.lng+"||"+temp.lat);
        let point = new BMap.Point(temp.lng,temp.lat);
        this.formValidate.lon = temp.lng;
        this.formValidate.lat = temp.lat;
        let marker = new BMap.Marker(point);
        map.addOverlay(marker);
      },
      myFun (result) {
        var cityName = result.name;
        map.setCenter(cityName);
        console.log("当前定位城市:"+cityName);
      },
      showInfo (e) {
        let allOverlay = map.getOverlays();
        for (let item of allOverlay){
          map.removeOverlay(item);
        }
        let point = new BMap.Point(e.point.lng, e.point.lat);
        this.formValidate.lon = e.point.lng;
        this.formValidate.lat = e.point.lat;
        let marker = new BMap.Marker(point);
        map.addOverlay(marker);
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
            _this.imgs.push(url);
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
      handleView (item) {
        this.img = item;
        this.visible = true;
      },
      handleRemove (item) {
        let index = this.imgs.indexOf(item);
        this.imgs.splice(index,1);
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
        this.formValidate.imgs = JSON.stringify(this.imgs);
        this.formValidate.division = this.division;
        store.updateMarket(this.formValidate, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.$Message.success('修改成功!', 1 , function () {
              _this.$router.go('/market/list');
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
