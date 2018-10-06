<template>
    <div class="user-mag-wrap">
        <el-card  shadow="hover">
            <el-table
            :data="table_data"
            :default-sort = "{prop: 'time', order: 'descending'}"
            @sort-change="sortChange"
            @filter-change="filterChange"
            style="width: 100%"
            v-loading="loading">
              <el-table-column
                sortable="custom"
                fixed
                prop="time"
                label="操作时间"
                width="200"
                :formatter="(row, column, cellValue, index)=>cellValue.replace(/[TZ]/g,' ').replace('.000','')">
                </el-table-column>
                <el-table-column
                prop="_describe"
                label="操作描述"
                min-width="240">
                </el-table-column>
                <el-table-column
                  sortable="custom"
                    prop="account"
                    label="account"
                    column-key="account"
                    width="120"
                    fixed="right"
                    :filters="table.account_filters"
                    :filter-method="() => true"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                      <el-tag
                        type="primary"
                        disable-transitions>{{scope.row.account}}</el-tag>
                    </template>
                  </el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="oid"
                    label="操作ID"
                    column-key="oid"
                    fixed="right"
                    width="100"
                    :filters="table.oid_filters"
                    :filter-method="() => true"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                      <el-tag
                        type="success"
                        disable-transitions>{{scope.row.oid}}</el-tag>
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

.el-select {
  width: 100%;
}
</style>
<script>
import CONST from "../assets/CONST";
import Util from "../assets/Util";

export default {
  name: "UserPower",
  data() {
    return {
      loading: false,
      table_data: [],
      table: {
        prop: "default",
        order: "ascending", //ascending or descending
        page_size: 5,
        current_page: 1,
        account_filters: [
        ],
        oid_filters: [
        ],
        account: CONST.NONE,
        oid: CONST.NONE
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
    filterChange(filter) {
      this.table.current_page = 1;
      if (filter.hasOwnProperty("account")) {
        this.table.account = filter.account.length > 0? filter.account[0]:CONST.NONE;
      }else{
        this.table.oid = filter.oid.length > 0? filter.oid[0]:CONST.NONE;
      }
      this.requestData();
    },
    getAccountFilters(data) {
      let key = this.$store.state.user.key;
      Util.cRequest(this, "/users/allusers", { key }, data => {
        switch (data.service_code) {
          case CONST.USERS_ALL:
          data.result.forEach(element => {
            this.table.account_filters.push({text: element.account,value: element.account})
          });
            
            break;
          default:
            this.table.account_filters = [];
            Util.showTip(this, "warning", "UNKNOW ERROR!");
            break;
        }
      });
    },
    getOidFilters(data) {
      let key = this.$store.state.user.key;
      Util.cRequest(this, "/users/alloperations", { key }, data => {
        switch (data.service_code) {
          case CONST.OPERATIONS_ALL:
            data.result.forEach(element => {
            this.table.oid_filters.push({text: element.id,value: element.id})
          });
            break;
          default:
            this.table.oid_filters = [];
            Util.showTip(this, "warning", "UNKNOW ERROR!");
            break;
        }
      });
    },
    requestData() {
      this.loading = true;
      let { current_page, order, page_size, prop, account, oid } = this.table;
      let key = this.$store.state.user.key;

      Util.cRequest(
        this,
        "/users/operationlogs",
        { current_page, order, page_size, prop, key, account, oid },
        data => {
          switch (data.service_code) {
            case CONST.OPERATION_LOGS:
              this.table_data = data.result;
              this.table.total = data.result[0]? data.result[0].total: 0;
              break;
            default:
              this.table_data = [];
              Util.showTip(this, "warning", "UNKNOW ERROR!");
              break;
          }
        }
      );
    }
  },
  mounted() {},
  created() {
    this.getAccountFilters();
    this.getOidFilters();
  },
  watch: {}
};
</script>
