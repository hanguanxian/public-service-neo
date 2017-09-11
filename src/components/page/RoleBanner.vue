<template>
<div class="table">
  <base-page
      ref="basePage"
      :search-items="searchItems"
      :dialog-items="dialogItems"
      :table-columns="tableConfig.columns"
      :table-action-btns="tableConfig.tableActionBtns"
      :url-list="urlList"
      >
  </base-page>
</div>
</template>

<script>
import BasePage from "../common/BasePage.vue"

export default {
  data() {
    const self = this;
    return {
      //查询框配置
      searchItems: [
        {name: '所属项目',placeholder: '所属项目',key: 'projectId',type: 'cascader',relative: 'positionCodes',selectOptions: []},
        {name: '推送位置',placeholder: '推送位置',key: 'positionCodes',type: 'select',selectOptions: []},
        {name: '版本编码',placeholder: '版本编码',key: 'appVersionStr'},
        {name: '是否显示:',placeholder: '是否显示:',key: 'isShow',type: 'select',selectOptions: [{label: "是",value: 1}, {label: "否",value: 0}]}
      ],
      //弹出框配置
      dialogItems: [
        {name: '所属项目',placeholder: '所属项目',key: 'projectId',type: 'cascader',relative: 'positionCodes',selectOptions: []},
        {name: '上传图片',formNmae: 'imgUploader',type: 'file',action: '/interface/banner/upload',key: 'picSrc'},
        {name: '推送位置',placeholder: '推送位置',key: 'positionCodes',type: 'select',selectOptions: []},
        {name: '是否本地应用:',key: 'isAppOpen',type: 'select',rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          selectOptions: [{label: "是",value: 1},{label: "否",value: 0}]},
        {name: '外跳链接',rules: {required: false},key: 'h5Url'},
        {name: '安卓关键字',rules: {required: false},key: 'androidKey'},
        {name: 'ios关键字',rules: {required: false},key: 'iosKey'},
        {name: '排序',type: 'number',rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},key: 'sort'},
        {name: '版本编码',rules: {required: false},key: 'appVersionStr'},
        {name: '备注', type: 'textarea', rules: {required: false},key: 'remark'}
      ],
      //表格配置
      tableConfig: {
        columns: [
          {name: 'ID',key: 'autoId'},
          {name: '所属项目',key: 'projectId'},
          {name: '所属项目',key: 'appClientStr'},
          {name: 'banner图位置标识',key: 'positionCodes'},
          {name: '图片',type: 'image',key: 'picSrc'},
          {name: '版本编码',key: 'appVersionStr'},
          {name: '是否本地应用打开',type: 'boolean',boolName: ['是','否'],key: 'isAppOpen'},
          {name: '外跳链接',type: 'href',key: 'h5Url'},
          {name: '安卓关键字',type: 'href',  key: 'androidKey'},
          {name: 'ios关键字',type: 'href',key: 'iosKey'},
          {name: '排序',key: 'sort'},
          {name: '是否显示',type: 'boolean', boolName: ['是','否'],  key: 'isShow'},
          {name: '备注',key: 'remark'}
        ],
        tableActionBtns: [{
            name: "修改",
            icon: "fa-pencil",
            event(row) {
              if(row.isShow) {
                self.$message.error('已启用的banner图不允许修改！');
              } else {
                self.$refs.basePage.dialogVisible = true;
                self.$refs.basePage.dialogForm.options.submitUrl = self.$refs.basePage.updateRowUrl;
                self.$refs.basePage.dialogForm.items[0].disabled = true;
                row.isAppOpen = row.isAppOpen ? 1 : 0;
                let copyRow = JSON.stringify(row);
                self.$refs.basePage.dialogFormData = JSON.parse(copyRow);
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
                    self.$refs.basePage.getTableData();
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
              if(row.isShow) {
                self.$message.error('已经启用过');
                return false;
              }
              self.$axios.post("/interface/banner/use_banner", {
                autoId: row.autoId
              }).then((res) => {
                if (res.data.status == true) {
                  self.$message.success('启用成功');
                  self.$refs.basePage.getTableData();
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
      urlList: {
        dataListUrl: '/interface/banner/banner_list',
        newRowUrl: '/interface/banner/create_banner', //表格全部数据请求地址
        updateRowUrl: "/interface/banner/edit_banner", //更新列表的行链接
        deleteRowUrl: "/interface/banner/remove_banner" //更新列表的行链接
      }
    }
  },
  components: {
    BasePage
  },
  created() {
    this.projectList();
  },
  methods: {
    projectList(){
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
        self.searchItems[0].selectOptions = tempArry;
        self.dialogItems[0].selectOptions = tempArry;
      })
    }
  }
}
</script>
