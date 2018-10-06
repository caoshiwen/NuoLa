<template>
    <div class="user-mag-wrap">
        <el-card  shadow="hover">
            <el-button @click="AddForm.visible = true">添加</el-button>
            <span class="tip">Tip: 用户权限以及操作权限修改为添加操作，想改变某条目，请先直接删除。</span>
            <el-table
            :data="table_data"
            :default-sort = "{prop: 'id', order: 'descending'}"
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
                label="账户"
                width="120">
                </el-table-column>
                <el-table-column
                sortable="custom"
                fixed
                prop="id"
                label="权限ID"
                width="120">
                </el-table-column>
                <el-table-column
                prop="_describe"
                label="权限描述"
                min-width="240">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="deleteUserpower(scope.$index)"
                    type="text"
                    size="small">
                    删除
                    </el-button>
                    <el-button
                    @click.native.prevent="updateUserpower(scope.$index)"
                    type="text"
                    size="small">
                    修改
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
        <el-dialog title="分配权限" :visible.sync="AddForm.visible" :width="'360px'">
          <el-form  :model="AddForm" v-loading="AddForm.loading">
            <el-form-item>
                <el-select v-model="AddForm.account" placeholder="请选择用户">
                  <el-option
                    v-for="item in AddForm.users"
                    :key="item.account"
                    :label="`${item.name}:${item.account}`"
                    :value="item.account"
                    :disabled="item.state=='1'?false:true">
                  </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item> -->
              <el-select v-model="AddForm.id" placeholder="请选择权限">
                  <el-option
                    v-for="item in AddForm.permissions"
                    :key="item.id"
                    :label="`${item.id}:${item._describe}`"
                    :value="item.id">
                  </el-option>
                </el-select>             
            <!-- </el-form-item> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="AddForm.visible = false">取 消</el-button>
            <el-button type="primary" @click="addUserpower">确 定</el-button>
          </div>
        </el-dialog>
    </div>    
</template>
<style lang="scss" scoped>
.pagination {
  text-align: center;
}

.el-select {
  width: 100%;
}
.tip {
  float: right;
  color: #666;
  font-size: 0.8em;
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
        current_page: 1
      },
      AddForm: {
        visible: false,
        account: "",
        id: "",
        loading: false,
        users: [],
        permissions: []
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

      Util.cRequest(
        this,
        "/users/userpowers",
        { current_page, order, page_size, prop, key },
        data => {
          switch (data.service_code) {
            case CONST.USERPOWERS:
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
    },
    addUserpower() {
      this.AddForm.loading = true;
      let { account, id } = this.AddForm;
      let key = this.$store.state.user.key;
      Util.cRequest(this, "/users/adduserpower", { key, account, id }, data => {
        this.AddForm.loading = false;
        console.log(data.service_code);
        switch (data.service_code) {
          case CONST.USERPOWER_ADD:
            Util.showTip(this, "success", "OPERATE SUCCESSFULLY!");
            this.requestData();
            this.AddForm.account = "";
            this.AddForm.id = "";
            break;
          case CONST.USERPOWER_ADD_FAILED:
            Util.showTip(this, "warning", "THE USER HAS THIS POWER ALREADY!");
            break;
          default:
            this.table_data = [];
            Util.showTip(this, "warning", "UNKNOW ERROR!");
            break;
        }
      });
    },
    updateUserpower(index) {
      let id = this.table_data[index].id;
      let account = this.table_data[index].account;
      this.AddForm.visible = true;
      this.AddForm.id = id;
      this.AddForm.account = account;
    },
    deleteUserpower(index) {
      let key = this.$store.state.user.key;
      let id = this.table_data[index].id;
      let account = this.table_data[index].account;
      Util.cRequest(
        this,
        "/users/deleteuserpower",
        { key, id, account },
        data => {
          switch (data.service_code) {
            case CONST.USERPOWER_DELETE:
              Util.showTip(this, "success", "DELETE SUCCESSFULLY!");
              if (this.table_data.length == 1 && this.table.current_page > 1) {
                this.table.current_page--;
              }
              this.requestData();
              break;
            case CONST.USERPOWER_DELETE_FAILED:
              Util.showTip(
                this,
                "warning",
                "EDLETE ERROR!REFRESH YOUR WEBPAGE!"
              );
              break;
            default:
              this.table_data = [];
              Util.showTip(this, "warning", "UNKNOW ERROR!");
              break;
          }
        }
      );
    },
    allUser() {
      let key = this.$store.state.user.key;
      Util.cRequest(this, "/users/allusers", { key }, data => {
        switch (data.service_code) {
          case CONST.USERS_ALL:
            this.AddForm.users = data.result;
            break;
          default:
            this.AddForm.users = [];
            Util.showTip(this, "warning", "GET ALL USERS UNKNOW ERROR!");
            break;
        }
      });
    },
    allPermission() {
      let key = this.$store.state.user.key;
      Util.cRequest(this, "/users/allpermissions", { key }, data => {
        switch (data.service_code) {
          case CONST.PERMISSIONS_ALL:
            this.AddForm.permissions = data.result;
            break;
          default:
            this.AddForm.permissions = [];
            Util.showTip(this, "warning", "GET ALL PERMISSIONS UNKNOW ERROR!");
            break;
        }
      });
    }
  },
  mounted() {},
  created() {
    this.allUser();
    this.allPermission();
  },
  watch: {}
};
</script>
