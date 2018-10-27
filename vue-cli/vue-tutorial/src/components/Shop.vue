<template>
<div class="wrap shop">
  <span style="display: none;">{{typesChage}}</span>
  <div id="shop" class="shop">
    <div class="banner">
      <img :src="banner" class="banner-img">
      <div class="above-banner">
        <div class="which-type">
          {{`SHOP | ${pt_type}${type?' | '+type:''}`.toLowerCase()}}
        </div>
      </div>
    </div>
    <div class="ipt-block clearfix">
      <div class="input-wrap">
        <ipt-type-one :Input="SearchInput"></ipt-type-one>
      </div>
      <i class="el-icon-search" @click="getItems"></i>
    </div>
    <div class="product-list">
      <el-row :gutter="10">
        <el-col :span="4" v-for="(item,key,index) in items" :key="index">
          
            <div class="product-item">
              <div class="item-img-wrap"  @click="$router.push(`/shop/detail/${item.id}`)">
                <img class="item-img" :src="SOURCE_HOST+item.img_src">
              </div>
              <div class="item-word-wrap">
                <a class="item-name" :href="`/shop/detail/${item.id}`">{{item.name.toLowerCase()}}</a>
                
                <a class="item-creator" :href="`/shop/detail/${item.id}`">
                  <strong>{{item.type}}</strong> by <strong>{{item.creator}}</strong>
                </a>
                
                <span class="item-price">{{item.price}}</span>
              </div>
            </div>
        </el-col>
      </el-row>
    </div>
    <div class="pagination-block clearfix">
      <el-pagination
        class="pagination"
        :page-size="this.pagination.size"
        :pager-count="this.pagination.count"
        layout="prev, pager, next"
        :total="this.pagination.total"
        @current-change="getItems">
      </el-pagination>
    </div>
  </div>
</div>
</template>

<style lang='scss' scoped>
@import "../assets/scss/common.scss";
.wrap {
  width: 100%;
  height: 100%;
  transition: 0.6s height;
  // background-color: rgb(238,238,238);
}
.shop {
  min-width: $MIN_WIDTH;
  max-width: $MAX_WIDTH;
  margin: 0 auto;
  padding: 40px 2rem 1rem;
  @extend .clearfix;
}

.banner {
  position: relative;
  .banner-img {
    width: 100%;
  }
  .above-banner {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .which-type {
    font-size: 2.5rem;
    background-color: #ec407a;
    color: #fff;
    font-family: "Roboto Slab";
    position: absolute;
    bottom: 10%;
    font-weight: 100;
    line-height: 2;
    padding: 0 1.5rem;
    text-transform: capitalize;
  }
}
.ipt-block {
  padding: 18px 0 48px 0;
}
.input-wrap {
  width: 36%;
  float: right;
}
.el-icon-search {
  transition: 0.3s color;
  &:hover {
    cursor: pointer;
    color: #409eff;
  }
  float: right;
  font-size: 2rem;
  margin-top: 20px;
  margin-right: 10px;
}
.product-list {
  transition: 0.6s height;
}

.product-item {
  height: 244px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 14px;
  border-radius: 2px;
  transition: transform 0.4s;
  &:hover {
    transform: scale(1.3);
  }
  .item-img-wrap {
    width: 100%;
    height: 180px;
    &:hover {
      cursor: pointer;
    }
    .item-img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .item-word-wrap {
    line-height: 1.2;
    padding: 0.5rem 8%;
  }
  .item-name {
    display: block;
    line-height: 1;
    text-transform: capitalize;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(0, 0, 0, 0.87);
  }
  .item-creator {
    display: block;
    color: #666;
    font-size: 0.9rem;
    line-height: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    strong {
      font-weight: 600;
    }
  }
  .item-price {
    float: right;
    color: #ec407a;
    font-size: 15px;
    font-family: "Roboto";
  }
}
</style>
<style lang="scss">
.shop {
  .ipt-type-one {
    .placeholder {
      top: 1.8rem !important;
      &.active {
        top: 0 !important;
      }
    }
    .input {
      background: none;
    }
  }
  .pagination-block {
    .pagination {
      padding: 30px 0px 10px;
      float: right;
      background: none;
      * {
        background-color: inherit !important;
      }
    }
  }
}

</style>

<script>
import Util from "../assets/Util";
import bannerImg from "../assets/img/leggings.jpg";
import InputPlaceholderChange from "./InputPlaceholderChange";
import CONST from "../assets/CONST";
import Rsa from "../assets/Encryption";
const { encryptRsa, decryptRsa, pwdEncrypt } = Rsa;
export default {
  name: "Shop",
  data() {
    return {
      SOURCE_HOST: CONST.SOURCE_HOST,
      banner: "",
      pt_type: "",
      type: "",
      SearchInput: {
        id: "search",
        name: "search",
        placeholder: "Search",
        value: "",
        old_value: "",
        type: "text",
        maxlength: 32
      },
      items: [],
      pagination: {
        total: 0,
        size: 24,
        count: 7,
        current: 1
      }
    };
  },
  components: {
    "ipt-type-one": InputPlaceholderChange
  },
  computed: {
    getTypesMap: function() {
      let r = {};
      let result = this.$store.state.types;
      for (const key in result) {
        if (result.hasOwnProperty(key)) {
          const element = result[key];
          if (!r.hasOwnProperty(element.name)) {
            r[element.name] = element.img;
          }
        }
      }
      return r;
    },
    typesChage() {
      if (this.$store.state.types) {
        this.getData();
      }
      return this.$store.state.types;
    }
  },
  mounted() {},
  methods: {
    getData() {
      this.type = this.$route.params.type;
      this.pt_type = this.$route.params.toptype;

      this.pagination.total = 0;
      if (this.type) {
        this.banner = this.getTypesMap[this.type];
      } else {
        this.banner =
          this.pt_type.toLowerCase().replace(/[^a-z0-9]/g, "") + ".jpg";
      }
      this.banner = CONST.SOURCE_HOST + this.banner;
      this.getItems();
    },
    getItems(current) {
      if (!current) {
        current = 1;
      }
      current = this.SearchInput.old_value == this.SearchInput.value? current : 1;
      let type = this.type ? encryptRsa(this.type) : "",
        pt_type = encryptRsa(this.pt_type),
        size = encryptRsa(this.pagination.size + ""),
        like = this.SearchInput.value ? encryptRsa(this.SearchInput.value) : "";
        current = encryptRsa(current + "");
      this.$http
        .post(CONST.HOST + "/product/list", {
          type,
          pt_type,
          current,
          size,
          like
        })
        .then(response => {
          let {
            data: { result, service_code }
          } = response;
          this.SearchInput.old_value = this.SearchInput.value;
          result = JSON.parse(decryptRsa(result));
          service_code = decryptRsa(service_code);
          if (result.length > 0) {
            this.items = result;
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
  }
};
</script>
 