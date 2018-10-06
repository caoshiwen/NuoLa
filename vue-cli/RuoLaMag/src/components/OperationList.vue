<template>
    <div class="user-mag-wrap">
        <el-card  shadow="hover">
            <el-button @click="AddForm.visible = true">增/改</el-button>
            <el-table
            :data="table_data"
            :default-sort = "{prop: 'id', order: 'descending'}"
            @sort-change="sortChange"
            style="width: 100%"
            v-loading="loading">
                <el-table-column
                sortable="custom"
                fixed
                prop="id"
                label="操作ID"
                width="120">
                </el-table-column>
                <el-table-column
                prop="_describe"
                label="操作描述"
                min-width="240">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="deleteOperation(scope.$index)"
                    type="text"
                    size="small">
                    删除
                    </el-button>
                    <el-button
                    @click.native.prevent="updateOperation(scope.$index)"
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
        <el-dialog title="添加操作" :visible.sync="AddForm.visible" :width="'400px'">
          <el-form  :model="AddForm" v-loading="AddForm.loading">
            <el-form-item>
              <el-input v-model="AddForm.id" auto-complete="off" placeholder="操作ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="AddForm._describe" auto-complete="off" placeholder="操作描述"></el-input>              
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="AddForm.visible = false">取 消</el-button>
            <el-button type="primary" @click="addOperation">确 定</el-button>
          </div>
        </el-dialog>
    </div>    
</template>
<style lang="scss" scoped>
.pagination {
  text-align: center;
}
.add-form {
  width: 400px !important;
}
</style>
<script>
import CONST from "../assets/CONST";
import Util from "../assets/Util";

export default {
  name: "OperationList",
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
        id: "",
        _describe: "",
        loading: false
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
        "/users/operations",
        { current_page, order, page_size, prop, key },
        data => {
          switch (data.service_code) {
            case CONST.OPERATIONS:
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
    addOperation() {
      this.AddForm.loading = true;
      let { id, _describe } = this.AddForm;
      let key = this.$store.state.user.key;
      Util.cRequest(
        this,
        "/users/addoperation",
        { key, id, _describe },
        data => {
          this.AddForm.loading = false;
          console.log(data.service_code);
          switch (data.service_code) {
            case CONST.OPERATION_ADD:
              Util.showTip(this, "success", "OPERATE SUCCESSFULLY!");
              this.requestData();
              this.AddForm.id = "";
              this.AddForm._describe = "";
              break;
            case CONST.OPERATION_ADD_FAILED:
              Util.showTip(
                this,
                "warning",
                "PLEASE CHECK THE ID THAT MAY HAVE BEEN USED!"
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
    updateOperation(index) {
      let id = this.table_data[index].id;
      this.AddForm.visible = true;
      this.AddForm.id = id;
    },
    deleteOperation(index) {
      let key = this.$store.state.user.key;
      let id = this.table_data[index].id;
      Util.cRequest(this, "/users/deleteoperation", { key, id }, data => {
        switch (data.service_code) {
          case CONST.OPERATION_DELETE:
            Util.showTip(this, "success", "DELETE SUCCESSFULLY!");
            if (this.table_data.length == 1 && this.table.current_page > 1) {
              this.table.current_page--;
            }
            this.requestData();
            break;
          case CONST.OPERATION_DELETE_FAILED:
            Util.showTip(this, "warning", "EDLETE ERROR!REFRESH YOUR WEBPAGE!");
            break;
          default:
            this.table_data = [];
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
