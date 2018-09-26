<template>
    <div class="user-mag-wrap">
        <el-card  shadow="hover">
            <el-button>新增</el-button>
            <el-table
            :data="users_data"
            :default-sort = "{prop: 'name', order: 'descending'}"
            @sort-change="sortChange"
            style="width: 100%"
            v-loading="loading">
                <el-table-column
                sortable="custom"
                fixed
                prop="name"
                label="姓名"
                width="120">
                </el-table-column>
                <el-table-column  
                sortable="custom"
                prop="account"
                label="账号"
                width="120">
                </el-table-column>
                <el-table-column
                prop="power"
                label="权限"
                min-width="240">
                </el-table-column>
                <el-table-column
                sortable="custom"
                prop="state" 
                label="状态"
                width="120">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="changeAccountState(scope.$index, '0')"
                    type="text"
                    size="small"
                    v-if="users_data[scope.$index].state">
                    禁用
                    </el-button>
                    <el-button
                    @click.native.prevent="changeAccountState(scope.$index, '1')"
                    type="text"
                    size="small"
                    v-else>
                    启用
                    </el-button>
                </template>
                </el-table-column>
            </el-table>
            <el-pagination
              class="pagination"
              :page-size="table.page_size"
              :page-sizes="[5,10,20,50,100]"
              :total="table.total"
              layout="prev, pager, next, total, slot ,sizes"
              @size-change="sizeChange"
              @current-change='currentChange'
              >
            </el-pagination>
        </el-card>
    </div>    
</template>
<style lang="scss" scoped>
.pagination {
  text-align: center;
}
</style>
<script>
import CONST from "../assets/CONST";
import Util from "../assets/Util";

export default {
  name: "UserMag",
  data() {
    return {
      loading: false,
      users_data: [
        {
          name: "admin",
          account: "admin",
          state: 1
        },
        {
          name: "test1",
          account: "test1account",
          state: 0
        }
      ],
      table: {
        prop: "default",
        order: "ascending", //ascending or descending
        page_size: 5,
        current_page: 1
      }
    };
  },
  methods: {
    sortChange({ order, prop }) {
      this.table.prop = prop;
      this.table.order = order;
      this.requestData();
    },
    sizeChange(page_size) {
      this.table.page_size = page_size;
      this.requestData();
    },
    currentChange(current_page) {
      this.table.current_page = current_page;
      this.requestData();
    },
    requestData() {
      this.loading = true;
      let { current_page, order, page_size, prop } = this.table;
      let key = this.$store.state.user.key;

      Util.cRequest(this, 
      "/users/list", 
      {current_page,order,page_size,prop,key }, 
      data => {
        switch (data.service_code) {
          case CONST.USER_LIST:
            this.users_data = data.result;
            this.table.total = data.result[0].total;
            break;
          default:
            this.users_data = [];
            Util.showTip(this, "warning", "UNKNOW ERROR!");
            break;
        }
      });
    },

    changeAccountState(index, state) {
      let key = this.$store.state.user.key;
      let account = this.users_data[index].account;
      Util.cRequest(this, "/users/banuser", { key, account, state }, 
      data => {
        switch (data.service_code) {
          case CONST.USER_CHANGE_SATAE:
            Util.showTip(this, "success", "CHANGE SUCCESSFULLY!");
            this.requestData();
            break;
          case CONST.USER_CHANGE_SATAE_FAILED:
            Util.showTip(this, "warning", "NO PERMISSION TO BAN YOURSELF OR SOMETHING OTHER WRONG!");
            break;
          default:
            this.users_data = [];
            Util.showTip(this, "warning", "UNKNOW ERROR!");
            break;
        }
      });
    }
  },
  mounted() {},
  watch: {}
};
</script>
