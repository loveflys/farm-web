<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/user/add')">新建</i-button>
  </Row>



  <i-col class="tabs-style" style="background: #e3e8ee;padding:16px;height: 100vh;">
    <Tabs type="card" :active-key.sync="tabkey">
      <Tab-pane key="all" label="所有">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
      <Tab-pane key="user" label="用户">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
      <Tab-pane key="notverify" label="待审核商户">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
      <Tab-pane key="business" label="商户">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
    </Tabs>
  </i-col>

  <Modal
    :visible.sync="modal"
    :title="modaltitle"
    closable="false"
    mask-closable="false"
    ok-text="审核通过"
    cancel-text="审核不通过"
    @on-ok="pass"
    @on-cancel="showrefuse">
    <p>真实姓名：</p>{{checkitem.realName}}<br />
    <p>商铺地址: </p>
    <div id="allmap" style="height: 50vh;"></div><br />
    <p>所属市场: </p>{{checkitem.marketName}}<br />
    <p>摊位正面照片: </p><br />
    <img :src="checkitem.shopImg" style="width: 100px;" /><br />
    <p>手持身份证照片: </p><br />
    <img :src="checkitem.identityImg" style="width: 100px;" /><br />
  </Modal>
  <Modal
      title="拒绝理由"
      :visible.sync="refusemodal"
      @on-ok="refuse"
      class-name="vertical-center-modal">
      <i-input type="textarea" :value.sync="reason" placeholder="请输入拒绝理由"></i-input>
  </Modal>
</template>
<script>
  import store from '../store/user.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        pageIndex: 1,
        startDate: 0,
        endDate: 0,
        pageSize: 10,
        pageCount: 1,
        tabkey: 'all',
        modal: false,
        refusemodal: false,
        reason: '',
        modaltitle: '123',
        checkitem: null,
        key: '',
        status: '-1', //审核状态  	 * 0-未审核     	 * 1-待审核     	 * 2-审核通过     	 * 3-审核不通过
        type: '0', //1-用户 2-商户
        self: this,
        columns: [
          {
            title: '头像',
            key: 'avatar',
            render (row, column, index) {
              return `<img src="${row.avatar}" style="width:100px;height:100px;" />`;
            }
          },
          {
            title: '类型',
            key: 'divisionCode',
            render (row, column, index) {
              return `${row.type===1?"用户":"商户"}`;
            }
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '真实姓名',
            key: 'realName'
          },
          {
            title: '手机号码',
            key: 'phone'
          },
          {
            title: '状态',
            key: 'status',
            render (row, column, index) {
              return `${row.type===1?(row.disabled?"禁用":"正常"):(row.status===0?"未审核":(row.status===1?"待审核":(row.status===2?(row.disabled?"禁用":"审核通过"):"审核不通过")))}`;
            }
          },
          {
            title: 'id',
            key: 'id'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render (row, column, index) {
              return `<i-button type="primary" size="small" @click="edit(${index})">编辑</i-button><i-button v-if="${row.status===1}" type="success" size="small" @click="check(${index})">审核</i-button> <i-button v-if="${row.status===2}" type="${row.disabled===0?'error':'success'}" size="small" @click="update(${index})">${row.disabled===0?"封停":"启用"}</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
            }
          }
        ],
        data: []
      }
    },
    watch : {
      tabkey () {
        switch(this.tabkey) {
          case "all":
            this.type = "0";
            this.status = "-1";
            break;
          case "user":
            this.type = "1";
            this.status = "-1";
            break;
          case "notverify":
            this.type = "2";
            this.status = "1";
            break;
          case "business":
            this.type = "2";
            this.status = "-1";
            break;
        }
        this.getData();
      },
      pageIndex () {
        this.getData();
      }
    },
    ready() {
      window.x = this;
      this.getData();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "8-1";
      });
    },
    methods: {
      getMap () {
        window.map = new BMap.Map("allmap");
        if (this.checkitem.shopLocation) {
          let point = new BMap.Point(this.checkitem.shopLocation.longitude,this.checkitem.shopLocation.latitude);
          map.centerAndZoom(point,18);
          map.enableScrollWheelZoom();
          var myCity = new BMap.LocalCity();
          this.setCenter();
        } else {
          console.log('nolocation');
          let point = new BMap.Point(116.331398,39.897445);
          map.centerAndZoom(point,15);
          map.enableScrollWheelZoom();
          var myCity = new BMap.LocalCity();
          myCity.get(this.myFun);
          this.setCenter();
        }
        map.disableDoubleClickZoom()
      },
      setCenter() {
        let temp = map.getCenter();
        console.log("temp==>"+temp.lng+"||"+temp.lat);
        let point = new BMap.Point(temp.lng,temp.lat);
        this.checkitem.shopLocation.longitude = temp.lng;
        this.checkitem.shopLocation.latitude = temp.lat;
        let marker = new BMap.Marker(point);
        let allOverlay = map.getOverlays();
        for (let item of allOverlay){
          map.removeOverlay(item);
        }
        map.addOverlay(marker);
      },
      myFun (result) {
        var cityName = result.name;
        map.setCenter(cityName);
        console.log("当前定位城市:"+cityName);
      },
      getData () {
        let param = {
          name: this.key,
          status: this.status,
          type: this.type,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1,
          startDate: this.startDate,
          endDate: this.endDate
        }
        store.getUserList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.users;
            this.pageCount = msg.totalPage;
            if (this.data.length > 0) {
              this.checkitem = this.data[0];
            }
          } else {
            this.$Message.error('获取用户列表失败!');
          }
        });
      },
      update (index) {
        let param = {
          id: this.data[index].id,
          disabled: this.data[index].disabled===0?'1':'0'
        }
        let _this = this;

        if (param.disabled == 0) {
          store.updateUser(param, (msg)=> {
            if (msg.code === '0') {
              this.$Message.info('操作成功!', 1, function () {
                _this.getData();
              });
            } else {
              this.$Message.error('操作失败!');
            }
          });
        } else {
          this.$Modal.confirm({
              title: '提示',
              content: '是否封停该用户',
              okText: '封停',
              cancelText: '取消',
              onOk: () => {
                store.updateUser(param, (msg)=> {
                  if (msg.code === '0') {
                    this.$Message.info('操作成功!', 1, function () {
                      _this.getData();
                    });
                  } else {
                    this.$Message.error('操作失败!');
                  }
                });
              },
              onCancel: () => {

              }
          });
        }
      },
      remove (index) {
        this.$Modal.confirm({
            title: '提示',
            content: '是否删除该用户',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
              let param = {
                id: this.data[index].id
              }
              store.delUser(param, (msg)=> {
                if (msg.code === '0') {
                  this.data.splice(index, 1);
                } else {
                  this.$Message.error('删除用户失败!');
                }
              });
            },
            onCancel: () => {

            }
        });
      },
      edit (index) {
        this.$router.go("/user/edit/"+this.data[index].id);
      },
      check (index) {
        this.checkitem = this.data[index];
        this.modaltitle = this.data[index].type === 1? "用户信息":"商户信息";
        this.getMap();
        this.modal = true;
      },
      pass () {
        if (!this.checkitem) {
          return;
        }
        let param = {
          id: this.checkitem.id,
          status: true
        }
        let _this = this;
        store.checkUser(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('操作成功!', 1, function () {
              _this.getData();
            });
          } else {
            this.$Message.error('操作失败!');
          }
        });
      },
      showrefuse () {
        if (!this.checkitem) {
          return;
        }
        this.modal = false;
        this.refusemodal = true;
        this.reason = "";
      },
      refuse () {
        let param = {
          id: this.checkitem.id,
          status: false,
          reason: this.reason
        }
        let _this = this;
        store.checkUser(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('操作成功!', 1, function () {
              _this.getData();
            });
          } else {
            this.$Message.error('操作失败!');
          }
        });
      }
    }
  }
</script>
