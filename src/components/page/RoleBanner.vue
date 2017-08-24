<template>
<div class="table">
  <!-- 搜索区域开始 -->
  <base-form :child-form-items="searchForm.items" :child-form-options="searchForm.options" :child-form-data="searchFormData" @submitCallBack="searchCallBack">
  </base-form>
  <!-- 搜索区域结束 -->
  <!-- 页面table开始 -->
  <base-table ref="myTable" :child-table-columns="tableConfig.columns" :child-table-options="tableConfig.tableOptions" :child-table-actions="tableConfig.tableActions" :child-table-data="tableData" @pageChange="pageChanged">
    <!-- 顶部工具栏 -->
    <div slot="topBtns">
      <group-btns :child-btns="topBtnsConfig"></group-btns>
    </div>
  </base-table>
  <!-- 页面table结束 -->
  <!-- 新建 编辑 页面弹出开始 -->
  <el-dialog :visible.sync="dialogVisible" size="small">
    <base-form :child-form-items="dialogForm.items" :child-form-options="dialogForm.options" :child-form-data="dialogFormData" @submitCallBack="dialogCallBack">
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
        items: [{
            name: '所属项目',
            placeholder: '所属项目',
            key: 'projectId',
            type: 'select',
            relative: 'positionCodes',
            event(value) {
              self.positionSelectList(value,self.searchForm.items[1]);
            },
            selectOptions: []
          },
          {
            name: '推送位置',
            placeholder: '推送位置',
            key: 'positionCodes',
            type: 'select',
            selectOptions: []
          },
          {
            name: '版本编码',
            placeholder: '版本编码',
            key: 'appVersionStr'
          },
          {
            name: '是否显示:',
            placeholder: '是否显示:',
            key: 'isShow',
            type: 'select',
            selectOptions: [{
              label: "是",
              value: 1
            }, {
              label: "否",
              value: 0
            }]
          }
        ],
        options: {
          submitUrl: "/interface/banner/banner_list", //新建的链接
          submitIcon: "search", //搜索按钮
          formClass: 'query-form', //向表单添加样式
          showLabel: false, //是否显示label标签
          inline: true, //输入框是否在一行内
          submitName: '搜索' //提交按钮文字
        }
      },
      //弹出框配置
      dialogForm: {
        items: [{
            name: '所属项目',
            placeholder: '所属项目',
            key: 'projectId',
            type: 'select',
            selectOptions: [],
            relative: 'positionCodes',
            event(value) {
              self.positionSelectList(value,self.dialogForm.items[2]);
            },
          }, {
            name: '上传图片',
            formNmae: 'imgUploader',
            type: 'file',
            action: '/interface/banner/upload',
            key: 'picSrc'
          }, {
            name: '推送位置',
            placeholder: '推送位置',
            key: 'positionCodes',
            type: 'select',
            selectOptions: []
          },
          {
            name: '是否本地应用:',
            key: 'isAppOpen',
            type: 'select',
            rules: {
              type: 'number',
              required: true,
              message: '必填',
              trigger: 'blur'
            },
            selectOptions: [
                {label: "是",value: 1},{label: "否",value: 0}
            ]
          }, {
            name: '外跳链接',
            key: 'h5Url'
          }, {
            name: '安卓关键字',
            key: 'androidKey'
          }, {
            name: 'ios关键字',
            key: 'iosKey'
          }, {
            name: '版本编码',
            key: 'appVersionStr'
          }, {
            name: '排序',
            type: 'number',
            rules: {
              type: 'number',
              required: true,
              message: '必填',
              trigger: 'blur'
            },
            key: 'sort'
          }, {
            name: '备注',
            type: 'textarea',
            rules: {required: false},
            key: 'remark'
          }
        ],
        options: {
          submitUrl: "/interface/banner/create_banner", //新建的链接
          submitRow: true, //提交按钮是否单独占一行
          defaultRules: {
            required: true,
            message: '必填',
            trigger: 'blur'
          }, //表单默认校验规则
          cancelBtnShow: true,
          labelWidth: "130px",
          submitName: '确定' //提交按钮文字
        }
      },
      //表格配置
      tableConfig: {
        columns: [{
          name: 'ID',
          key: 'autoId'
        }, {
          name: '所属项目',
          key: 'projectId'
        }, {
          name: '所属项目',
          key: 'appClientStr'
        }, {
          name: 'banner图位置标识',
          key: 'positionCodes'
        }, {
          name: '图片',
          type: 'image',
          key: 'picSrc'
        }, {
          name: '版本编码',
          key: 'appVersionStr'
        }, {
          name: '是否本地应用打开',
          type: 'boolean',
          boolName: ['是','否'],
          key: 'isAppOpen'
        }, {
          name: '外跳链接',
          type: 'href',
          key: 'h5Url'
        }, {
          name: '安卓关键字',
          key: 'androidKey'
        }, {
          name: 'ios关键字',
          key: 'iosKey'
        }, {
          name: '排序',
          key: 'sort'
        }, {
          name: '是否显示',
          type: 'boolean',
          boolName: ['是','否'],
          key: 'isShow'
        }, {
          name: '备注',
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
              if(row.isShow) {
                self.$message.error('已启用的banner图不允许修改！');
              } else {
                self.dialogVisible = true;
                self.dialogForm.options.submitUrl = self.updateRowUrl;
                self.dialogForm.items[0].disabled = true;
                row.isAppOpen = row.isAppOpen ? 1 : 0;
                let copyRow = JSON.stringify(row);
                self.dialogFormData = JSON.parse(copyRow);
              }
            }
          }, {
            name: "删除",
            icon: "fa-trash-o",
            event(row) {
              if(row.isShow) {
                self.$message.error('已启用的banner图不允许删除！');
              } else {
                self.$axios.post("/interface/banner/remove_banner", {
                  autoId: row.autoId
                }).then((res) => {
                  if (res.data.status == true) {
                    self.$message.success('删除成功');
                    self.getTableData();
                  }
                }).catch(function(error) {
                  self.$message.error('错误');
                });
              }

            }
          }, {
            name: "启用",
            icon: "fa-check",
            event(row) {
              self.$axios.post("/interface/banner/use_banner", {
                autoId: row.autoId
              }).then((res) => {
                if (res.data.status == true) {
                  self.$message.success('启用成功');
                  self.getTableData();
                }
              }).catch(function(error) {
                self.$message.error('错误');
              });
            }
          }, {
            name: "禁用",
            icon: "fa-close",
            event(row) {
              self.$axios.post("/interface/banner/unuse_banner", {
                autoId: row.autoId
              }).then((res) => {
                if (res.data.status == true) {
                  self.$message.success('禁用成功');
                  self.getTableData();
                }
              }).catch(function(error) {
                self.$message.error('错误');
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
          delete self.dialogForm.items[0].disabled;
          self.dialogFormData = {};
          self.dialogVisible = true;
        }
      }],
      dataListUrl: '/interface/banner/banner_list',
      newRowUrl: '/interface/banner/create_banner', //表格全部数据请求地址
      updateRowUrl: "/interface/banner/edit_banner", //更新列表的行链接
      unuseBannerUrl: "/interface/banner/unuse_banner",
      useBannerUrl: "/interface/banner/use_banner",
      deleteRowUrl: "/interface/banner/remove_banner", //更新列表的行链接
      dialogFormData: {}, //弹出框formData
      searchFormData: {},
      selectedTableRows: [], //选中的table 行
      tableData: [], //让搜索框的数据赋值到表格
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
      //console.log(JSON.stringify(tempArry));
      self.searchForm.items[0].selectOptions = tempArry;
      self.dialogForm.items[0].selectOptions = tempArry;
      if(tempArry.length > 0) {
          self.positionSelectList(tempArry[0].value,self.searchForm.items[1]);
          self.positionSelectList(tempArry[0].value,self.dialogForm.items[2]);
      }
    })

    this.getTableData();
  },
  methods: {
    searchCallBack(formData) { //搜索事件
      const self = this;
      formData.isShow = formData.isShow == 1 ? true : false;
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
    positionSelectList(projectId,items){
      const self = this;
      self.$axios.post('/interface/banner/position_select_list', {
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
    pageChanged(value) { //翻页的事件
      this.tablePage = value;
      this.getTableData();
    },
    getTableData() { //初始化表格数据
      const self = this;
      self.$axios.post(self.dataListUrl, {
        page: self.tablePage,
        rows: self.tableRows,
      }).then((res) => {
        self.tableData = res.data.data.rows;
        self.tableConfig.tableOptions.total = res.data.data.count;
        console.log(self.tableConfig.tableOptions.total);
      })
    },
    dialogCallBack(value) { //弹出框的提交事件
      const self = this;
      self.dialogVisible = false;
      self.$axios.post(self.dialogForm.options.submitUrl, self.dialogFormData).then((res) => {
        self.$message.success(res.data.msg);
        self.getTableData();
      }).catch(function(error) {
        self.$message.error('失败');
      });
    }
  }
}
</script>
