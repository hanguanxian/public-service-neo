<template>
    <div>
        <div>
            <slot name="topBtns"></slot>
        </div>
        <el-table :data="tableData" :stripe="options.stripe" border style="width: 100%"
                    @selection-change="selectionChange"
                    @cell-dblclick="cellDBClick"
                    @cell-click="cellClick"
                    @row-click="rowClick"
                    @row-dblclick="rowDBClick"
                    :highlight-current-row="true" >
          <el-table-column type="selection"></el-table-column> <!-- 勾选框 -->
          <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.key" :label="column.name" :width="column.width">
          </el-table-column>
          <el-table-column :label="tableActions.name" :width="tableActions.width" :fixed="tableActions.fixed">
              <template scope="scope">
                  <div class="tableAction">
                     <el-button v-for="(button, index) in tableActions.buttons"
                          :key="index" size="small"
                          @click="button.event(scope.row)" class="el-table-button"><i class="menu-icon fa" :class="button.icon"></i>{{ button.name }}</el-button>
                  </div>
              </template>
          </el-table-column>
        </el-table>
        <div>
            <slot name="bottomBtns"></slot>
        </div>
        <div class="pagination">
          <el-pagination @current-change="pageChange" layout="prev, pager, next" :total="1000">
          </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['childTableColumns','childTableOptions',"childTableActions","childTableData"],
        data: function(){
            const self = this;
            return {
                columns:  self.childTableColumns,
                options: self.childTableOptions,
                tableActions: self.childTableActions,
                multipleSelection: [] //选中的行
            }
        },
        computed: {
            tableData: function(){
                return this.childTableData
            }
        },
        created() {
        },
        methods: {
            pageChange(val) {//翻页
              this.$emit('pageChange', val);
            },
            cellDBClick(row, column, cell){
                this.$emit('cellDBClick', row[column.property],cell);
            },
            cellClick(row, column, cell){
                this.$emit('cellClick', row[column.property],cell);
            },
            rowClick(row, event, column){
                this.$emit('rowClick', row);
            },
            rowDBClick(row, event){
                this.$emit('rowDBClick', row);
            },
            selectionChange: function(val) {//选中表格数据
                this.multipleSelection = val;
                this.$emit('selectedRows', val);
            }
        }
    }
</script>
<style scoped>
    .el-table-button {
        margin: 5px;
    }
    .el-table .cell .tableAction  {
        text-align: left;
    }
</style>
