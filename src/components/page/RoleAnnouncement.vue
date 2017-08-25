<template>
<div class="table">
  <!-- 搜索区域开始 -->
  <base-form :child-form-items="searchForm.items"
            :child-form-options="searchForm.options"
            :child-form-data="searchFormData"
            @submitCallBack="searchCallBack">
  </base-form>
  <!-- 搜索区域结束 -->
  <!-- 页面table开始 -->
  <base-table ref="myTable"
        :child-table-columns="tableConfig.columns"
        :child-table-options="tableConfig.tableOptions"
        :child-table-actions="tableConfig.tableActions"
        :child-table-data="tableData"
        @pageChange="pageChanged">
        <!-- 顶部工具栏 -->
        <div slot="topBtns">
            <group-btns :child-btns="topBtnsConfig"></group-btns>
        </div>
  </base-table>
  <!-- 页面table结束 -->
  <!-- 新建 编辑 页面弹出开始 -->
  <el-dialog :visible.sync="dialogVisible" size="small">
    <base-form :child-form-items="dialogForm.items"
               :child-form-options="dialogForm.options"
               :child-form-data="dialogFormData"
               @submitCallBack="dialogCallBack">
    </base-form>
  </el-dialog>
  <!-- 新建 编辑 页面弹出结束 -->
</div>
</template>

<script>
import BaseForm from "../common/BaseForm.vue"
import BaseTable from "../common/BaseTable.vue"
import GroupBtns from "../common/GroupBtns.vue"
export default {
  data() {
    const self = this;
    return {
      //查询框配置
      searchForm: {
          items: [
                  {name: '公告ID',placeholder: '公告ID',key: 'announcementId'},
                  {name: '所属项目',placeholder: '所属项目', key: 'projectId',type: 'select',
                  relative: 'positionCodes',
                  event(value) {
                    //self.searchFormData.positionCodes = [];
                    self.positionSelectList(value,self.searchForm.items[2]);
                  },
                  selectOptions: []},
                  {name: '推送位置',placeholder: '推送位置', key: 'positionCodes',type: 'select',
                  selectOptions: []},
                  {name: '公告标题',placeholder: '公告标题', key: 'announcementName'}
              ],
        options: {
          submitUrl: "/interface/announcement/announcement-list", //新建的链接
          submitIcon: "search",//搜索按钮
          formClass: 'query-form', //向表单添加样式
          showLabel: false, //是否显示label标签
          inline: true, //输入框是否在一行内
          submitName: '搜索' //提交按钮文字
        }
      },
      //弹出框配置
      dialogForm: {
        items: [{name: '所属项目',placeholder: '所属项目', key: 'projectId',type: 'select',relative: 'positionCodes',relativeType: 'multipleSelect',
        event(value) {
          console.log(value);
          //self.dialogFormData.positionCodes = [];
          self.positionSelectList(value,self.dialogForm.items[1]);
        }},
        {name: '推送位置',placeholder: '推送位置', key: 'positionCodes',type: 'select',
        selectOptions: []}, {
          name: '公告标题',
          key: 'announcementName'
        }, {
          name: '公告内容',
          type: 'textarea',
          row: 4,
          key: 'announcementContent'
        }, {
          name: '公告日期',
          type: 'date',
          rules: {type: 'date',required: true,message: '必填',trigger: 'blur'},
          key: 'announcementDate'
        }, {
          name: '备注',
          type: 'textarea',
          rules: {required: false},
          key: 'remark'
        }],
        options: {
          submitUrl: "/interface/announcement/announcement-add", //新建的链接
          submitRow: true,//提交按钮是否单独占一行
          defaultRules: {
            required: true,
            message: '必填',
            trigger: 'blur'
          }, //表单默认校验规则
          //inline: true, //输入框是否在一行内
          labelWidth: "130px",
          submitName: '确定' //提交按钮文字
        }
      },
      //表格配置
      tableConfig: {
        columns: [{
          name: '公告ID',
          width: "180px",
          key: 'announcementId'
        }, {
          name: '所属项目',
          key: 'projectName'
        }, {
          name: '推送位置',
          key: 'positionNames'
        }, {
          name: '公告标题',
          width: "170px",
          type: 'richText',
          key: 'announcementName'
        }, {
          name: '公告内容',
          width: '200px',
          type: 'richText',
          key: 'announcementContent'
        }, {
          name: '公告日期',
          type: 'date',
          key: 'announcementDate'
        }, {
          name: '是否启用',
          type: 'boolean',
          boolName: ['是','否'],
          key: 'isEnable'
        }, {
          name: '备注',
          type: 'richText',
          key: 'remark'
        }],
        tableActions: {
          name: '操作',
          key: 'actions',
          fixed: "right",
          buttons: [{
            name: "修改",
            icon: "fa-pencil",
            event(row) {
              if(row.isEnable == true) {
                self.$message.error('已经启用状态不可以编辑');
              } else {
                self.dialogVisible = true;
                self.dialogForm.options.submitUrl = self.updateRowUrl;
                row.positionCodes = row.positionCodes.split(',')[0] || '';
                //row.positionCodes = row.positionCodes.split(',') || [];
                self.dialogFormData = JSON.parse(JSON.stringify(row));
              }
            }
          },{
            name: "启用",
            icon: "fa-check",
            event(row) {
              self.$axios.post('/interface/announcement/be-enabled', {autoId: row.autoId}).then((res) => {
                if (res.data.success == true) {
                  self.$message.success('启用成功');
                  self.getTableData();
                }
              }).catch(function(error) {
                self.$message.error('系统错误');
              });
            }
          }, {
            name: "禁用",
            icon: "fa-close",
            event(row) {
              self.$axios.post('/interface/announcement/be-disabled', {autoId: row.autoId}).then((res) => {
                if (res.data.success == true) {
                  self.$message.success('禁用成功');
                  self.getTableData();
                }
              }).catch(function(error) {
                self.$message.error('系统错误');
              });
            }
          }]
        },
        tableOptions: {}
      },
      //表格顶部按钮区域
      topBtnsConfig: [{
          name: "新建",
          event() {
            self.dialogForm.options.submitUrl = self.newRowUrl;
            self.dialogFormData = {};
            //self.dialogFormData.positionCodes = [];
            self.dialogVisible = true;
          }
      }],
      dataListUrl: '/interface/announcement/announcement-list',
      newRowUrl: '/interface/announcement/announcement-add', //表格全部数据请求地址
      updateRowUrl: "/interface/announcement/announcement-edit", //更新列表的行链接
      deleteRowUrl: "/interface/announcement/announcement-remove", //更新列表的行链接
      dialogFormData: {},//弹出框formData
      searchFormData: {},
      selectedTableRows:[],//选中的table 行
      tableData: [],//让搜索框的数据赋值到表格
      msg: '',
      tablePage: 1,
      tableRows: 25,
      dialogVisible: false
    }
  },
  components: {
    GroupBtns,
    BaseForm,
    BaseTable //富文本组件
  },
  created() {
      const self = this;
      self.$axios.post('/interface/banner/project_list').then((res) => {
          var selectOptions = res.data.data;
          var tempArry = [];
          for (var i = 0; i < selectOptions.length; i++) {
              var select = {};
              select.label = selectOptions[i].projectName;
              select.value = selectOptions[i].projectId;
              tempArry.push(select);
          }
          self.searchForm.items[1].selectOptions = tempArry;
          self.dialogForm.items[0].selectOptions = tempArry;
          if(tempArry.length > 0) {
              self.positionSelectList(tempArry[0].value,self.searchForm.items[2]);
              self.positionSelectList(tempArry[0].value,self.dialogForm.items[1]);
          }
      })
      //self.dialogFormData.positionCodes = [];
      this.getTableData();
  },
  methods: {
    searchCallBack(formData) {//搜索事件
      const self = this;
      console.log(formData);
      formData.page = 1;
      formData.rows = self.tableRows;
      self.$axios.post(self.searchForm.options.submitUrl, formData).then((res) => {
          self.tableData = res.data.data.rows;
          self.$message.success('搜索完成');
      }).catch(function (error) {
          self.$message.error('搜索失败');
      });
    },
    pageChanged(value) {//翻页的事件
        this.tablePage = value;
        this.getTableData();
    },
    positionSelectList(projectId,items){
      const self = this;
      self.$axios.post('/interface/announcement/position_select_list', {
        projectId: projectId
      }).then((res) => {
        var selectOptions = res.data.data;
        var tempArry = [];
        for (var i = 0; i < selectOptions.length; i++) {
          var select = {};
          select.label = selectOptions[i].positionName;
          select.value = selectOptions[i].positionCode;
          tempArry.push(select);
        }
        items.selectOptions = tempArry;
      })
    },
    getTableData() {//初始化表格数据
      const self = this;
      self.$axios.post(self.dataListUrl, {
        page: self.tablePage,
        rows: self.tableRows,
      }).then((res) => {
        self.tableData = res.data.data.rows;
        self.tableConfig.tableOptions.total = res.data.data.count;
        //Sconsole.log(self.tableConfig.tableOptions.total);
      })
    },
    dialogCallBack(value) {//弹出框的提交事件
      console.log(value);
      const self = this;

      self.dialogVisible = false;
      self.$axios.post(self.dialogForm.options.submitUrl, self.dialogFormData).then((res) => {
          self.$message.success(res.data.msg);
          this.getTableData();
      }).catch(function (error) {
          self.$message.error('失败');
      });
    }
  }
}
</script>
