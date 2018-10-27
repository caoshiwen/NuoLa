<template>
    <div id="orders" class="orders">
        <h3 class="address"><span class="nomal" v-html="address"></span><span class="strong">{{name}}</span></h3>
        <div class="info"><i class="el-icon-info"></i>{{info}}</div>
        <div class="orders-title clearfix"  v-loading="loading">
            <div class="id block">
              {{order}}
            </div>
            <div class="date block">
              {{date}}
            </div>
            <div class="ship block">
              {{ship}}
            </div>
            <div class="total block">
              {{total}}
            </div>
            <div class="status block">
              {{status}}
            </div>
        </div>
        <div class="items-wrap">
          <div class="item-wrap clearfix" v-for="item in items" :key="item.id">
            <div class="id block">
              {{item.id_fps}}
            </div>
            <div class="date block">
              {{item.time}}
            </div>
            <div class="ship block">
              {{item.address.name}}, {{item.address.phone}}, {{item.address.postal_code}}, {{item.address.street_address}}, {{item.address.city}}, {{item.address.state}}, {{item.address.country}}
            </div>
            <div class="total block">
              $ {{item.pay}}
            </div>
            <div class="status block">
              
            </div>
          </div>
      </div>
          <div class="pagination-block clearfix">
            <el-pagination
              class="pagination"
              :page-size="this.pagination.size"
              layout="prev, pager, next"
              :total="this.pagination.total"
              @current-change="getItems">
            </el-pagination>
          </div>
    </div>
</template>
<style lang="scss">
@import url("../assets/scss/reload.scss");
.orders .pagination-block {
  float: right;
  .pagination {
    padding: 30px 0px 10px;
    float: right;
    background: none;
    * {
      background-color: inherit !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.address {
  font-size: 1.3rem;
  height: 45px;
  line-height: 45px;
  font-weight: 300;
  padding-top: 0.5rem;
  color: #555;
}
.nomal {
  float: left;
}
.strong {
  font-size: 2rem;
  color: #333;
  // margin-top: .2rem;
  float: left;
}
.info {
  padding: 1em;
  background-color: #ddd;
  line-height: 1.5em;
  margin-top: 10px;
  border-radius: 2px;
  .el-icon-info {
    display: block;
    float: left;
    text-align: center;
    font-size: 20px;
    padding: 0.5em 1em 0.5em 0.3em;
  }
}
.orders-title {
  padding: 12px 16px 12px 0;
  border-radius: 2px;
  background-color: #fff;
  margin-top: 1rem;
  position: relative;
  border: 1px solid #e0e0e0;
  h4 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0.5rem 0;
  }
}
.items-wrap {
  // min-height: 320px;
  background-color: #fff;
  border: 1px solid #eee;
  margin-top: 10px;
  border-radius: 2px;
}
.item-wrap {
  border-bottom: 1px solid #eee;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  
  &:nth-last-of-type(1) {
    border-bottom: none;
  }
}
.id {
  width: 18%;
}
.date {
  width: 18%;
  display:table-cell; 
  vertical-align:middle;  
}
.ship {
  width: 28%;
}
.total {
  width: 18%;
}
.status {
  width: 18%;
}
.block {
  float: left;
  text-transform: uppercase;
  padding-left: 16px;
  word-break: break-all;
  
}
</style>

<script>
import CONST from "../assets/CONST.js";
import InputPlaceholderChange from "./InputPlaceholderChange";
import Encryption from "../assets/Encryption.js";
import { mapState } from "vuex";
import Util from "../assets/Util.js";
let { HOST, REGFOREMAIL } = CONST;
let { encryptRsa, decryptRsa, pwdEncrypt } = Encryption;

export default {
  name: "Orders",
  data() {
    return {
      info:
        "Here are your most recent orders. If you recently placed an order, please note that it can take a few hours for it to appears in the system. Click on one to see its details. If you have any inquiries, please contact us.",
      personal: "Personal",
      change_my_password: "Change my password",
      save: "SAVE",
      loading: false,
      address: "Account&nbsp;&nbsp;|&nbsp;&nbsp;",
      name: "Orders",
      order: "order #",
      date: "date",
      ship: "ship to",
      total: "total price",
      status: "status",
      items: [],
      pagination: {
        total: 0,
        size: 8,
        // count: 7,
        current: 1
      }
    };
  },
  computed: {},
  methods: {
    showTip: function(message, type) {
      Util.showTip(this, type, message);
    },
    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      this.loading = false;
    },
    getItems(current) {
      if (!current) {
        current = 1;
      }
      let size = encryptRsa(this.pagination.size + "");
      current = encryptRsa(current + "");
      let key = encryptRsa(this.$store.state.user.key);
      let id = encryptRsa(this.$store.state.user.id);
      this.$http
        .post(CONST.HOST + "/order/list", {
          current,
          size,
          key,
          id
        })
        .then(response => {
          let {
            data: { result, service_code }
          } = response;
          result = JSON.parse(decryptRsa(result));
          service_code = decryptRsa(service_code);
          if (result.length > 0) {
            this.items = result;
            for (const key in this.items) {
              if (this.items.hasOwnProperty(key)) {
                const element = this.items[key];
                element.address = JSON.parse(element.address);
                element.price = JSON.parse(element.price);
              }
            }
            this.pagination.total = result[0].total;
          } else {
            this.items = 0;
            this.pagination.total = 0;
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  components: {},
  mounted() {
    this.getItems(1);
  }
};
</script>
